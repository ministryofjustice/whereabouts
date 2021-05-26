const appointmentDetails = require('../controllers/appointmentDetails.js')

describe('appointment details', () => {
  const testAppointment = {
    appointment: {
      offenderNo: 'ABC123',
      id: 1,
      agencyId: 'MDI',
      locationId: 2,
      appointmentTypeCode: 'GYM',
      startTime: '2021-05-20T13:00:00',
    },
    recurring: null,
    videoLinkBooking: null,
  }

  const prisonApi = {}
  const whereaboutsApi = {}

  let req
  let res
  let controller

  beforeEach(() => {
    req = {
      params: { id: 1 },
      session: { userDetails: { activeCaseLoadId: 'MDI' } },
      flash: jest.fn(),
    }
    res = { render: jest.fn() }

    prisonApi.getDetails = jest.fn().mockResolvedValue({
      firstName: 'BARRY',
      lastName: 'SMITH',
      offenderNo: 'ABC123',
    })
    prisonApi.getLocationsForAppointments = jest
      .fn()
      .mockResolvedValue([
        { userDescription: 'VCC Room 1', locationId: '1' },
        { userDescription: 'Gymnasium', locationId: '2' },
        { userDescription: 'VCC Room 2', locationId: '3' },
      ])
    prisonApi.getAppointmentTypes = jest
      .fn()
      .mockResolvedValue([{ code: 'GYM', description: 'Gym' }, { description: 'Video link booking', code: 'VLB' }])

    whereaboutsApi.getAppointment = jest.fn().mockResolvedValue(testAppointment)

    controller = appointmentDetails({ prisonApi, whereaboutsApi })
  })

  describe('viewAppointment', () => {
    it('should make the correct calls', async () => {
      await controller(req, res)

      expect(whereaboutsApi.getAppointment).toHaveBeenCalledWith(res.locals, 1)
      expect(prisonApi.getDetails).toHaveBeenCalledWith(res.locals, 'ABC123')
      expect(prisonApi.getLocationsForAppointments).toHaveBeenCalledWith(res.locals, 'MDI')
      expect(prisonApi.getAppointmentTypes).toHaveBeenCalledWith(res.locals)
    })

    it('should render with the correct appointment', async () => {
      await controller(req, res)

      expect(res.render).toHaveBeenCalledWith('appointmentDetails', {
        additionalDetails: {
          comments: 'Not entered',
        },
        basicDetails: {
          date: '20 May 2021',
          location: 'Gymnasium',
          type: 'Gym',
        },
        prepostData: {},
        prisoner: {
          name: 'Barry Smith',
          number: 'ABC123',
        },
        recurringDetails: {
          recurring: 'No',
        },
        timeDetails: {
          startTime: '13:00',
          endTime: 'Not entered',
        },
      })
    })

    it('should save the main details to flash', async () => {
      await controller(req, res)

      expect(req.flash).toHaveBeenCalledWith('appointmentDetails', {
        id: 1,
        isRecurring: false,
        additionalDetails: {
          comments: 'Not entered',
        },
        basicDetails: {
          date: '20 May 2021',
          location: 'Gymnasium',
          type: 'Gym',
        },
        prepostData: {},
        recurringDetails: {
          recurring: 'No',
        },
        timeDetails: {
          startTime: '13:00',
          endTime: 'Not entered',
        },
      })
    })

    describe('recurring appointment', () => {
      beforeEach(() => {
        whereaboutsApi.getAppointment = jest.fn().mockResolvedValue({
          ...testAppointment,
          recurring: {
            repeatPeriod: 'WEEKLY',
            count: 10,
          },
        })
      })

      it('should render with the recurring details', async () => {
        await controller(req, res)

        expect(res.render).toHaveBeenCalledWith(
          'appointmentDetails',
          expect.objectContaining({
            recurringDetails: {
              lastAppointment: '22 July 2021',
              recurring: 'Yes',
              repeats: 'Weekly',
            },
          })
        )
      })
    })

    describe('video link appointments', () => {
      let videoLinkBookingAppointment

      beforeEach(() => {
        videoLinkBookingAppointment = {
          appointment: {
            ...testAppointment.appointment,
            locationId: 1,
            appointmentTypeCode: 'VLB',
            startTime: '2021-05-20T13:00:00',
            endTime: '2021-05-20T14:00:00',
            comment: 'Test appointment comments',
          },
          videoLinkBooking: {
            main: {
              court: 'Nottingham Justice Centre',
              hearingType: 'MAIN',
              locationId: 1,
              startTime: '2021-05-20T13:00:00',
              endTime: '2021-05-20T14:00:00',
            },
          },
        }

        whereaboutsApi.getAppointment = jest.fn().mockResolvedValue(videoLinkBookingAppointment)
      })

      it('should render with court location and correct vlb locations and types', async () => {
        await controller(req, res)

        expect(res.render).toHaveBeenCalledWith(
          'appointmentDetails',
          expect.objectContaining({
            additionalDetails: {
              courtLocation: 'Nottingham Justice Centre',
              comments: 'Test appointment comments',
            },
            basicDetails: {
              date: '20 May 2021',
              location: 'VCC Room 1',
              type: 'Video link booking',
            },
            timeDetails: {
              startTime: '13:00',
              endTime: '14:00',
            },
          })
        )
      })

      describe('with pre appointment', () => {
        beforeEach(() => {
          videoLinkBookingAppointment.videoLinkBooking.pre = {
            court: 'Nottingham Justice Centre',
            hearingType: 'PRE',
            locationId: 3,
            startTime: '2021-05-20T12:45:00',
            endTime: '2021-05-20T13:00:00',
          }
          whereaboutsApi.getAppointment = jest.fn().mockResolvedValue(videoLinkBookingAppointment)
        })

        it('should render with the correct pre appointment details', async () => {
          await controller(req, res)

          expect(res.render).toHaveBeenCalledWith(
            'appointmentDetails',
            expect.objectContaining({
              prepostData: {
                'pre-court hearing briefing': 'VCC Room 2 - 12:45 to 13:00',
              },
            })
          )
        })
      })

      describe('with post appointment', () => {
        beforeEach(() => {
          videoLinkBookingAppointment.videoLinkBooking.post = {
            court: 'Nottingham Justice Centre',
            hearingType: 'POST',
            locationId: 3,
            startTime: '2021-05-20T14:00:00',
            endTime: '2021-05-20T14:15:00',
          }
          whereaboutsApi.getAppointment = jest.fn().mockResolvedValue(videoLinkBookingAppointment)
        })

        it('should render with the correct post appointment details', async () => {
          await controller(req, res)

          expect(res.render).toHaveBeenCalledWith(
            'appointmentDetails',
            expect.objectContaining({
              prepostData: {
                'post-court hearing briefing': 'VCC Room 2 - 14:00 to 14:15',
              },
            })
          )
        })
      })
    })
  })
})
