const { putLastNameFirst, formatName, formatTimestampToDate } = require('../../utils')
const { notEnteredMessage } = require('../../common-messages')

const csraTranslations = {
  LOW: 'Low',
  STANDARD: 'Standard',
  HI: 'High',
}

module.exports = ({ prisonApi }) => async (req, res, next) => {
  const { offenderNo } = req.params
  const { assessmentSeq } = req.query

  try {
    const prisonerDetails = await prisonApi.getDetails(res.locals, offenderNo)
    const { bookingId, firstName, lastName } = prisonerDetails

    const reviewDetails = await prisonApi.getCsraReviewForBooking(res.locals, bookingId, assessmentSeq)
    const { assessmentAgencyId, assessorUser, classificationCode, originalClassificationCode } = reviewDetails

    const agencyDetails = assessmentAgencyId ? await prisonApi.getAgencyDetails(res.locals, assessmentAgencyId) : {}
    const staffDetails = assessorUser ? await prisonApi.getStaffDetails(res.locals, assessorUser) : {}

    const csraLevelString = originalClassificationCode
      ? `${csraTranslations[classificationCode]} - this is an override from ${
          csraTranslations[originalClassificationCode]
        }`
      : csraTranslations[classificationCode]

    return res.render('prisonerProfile/prisonerCsraReview.njk', {
      breadcrumbPrisonerName: putLastNameFirst(firstName, lastName),
      details: [
        {
          key: { text: 'CSRA' },
          value: { text: csraLevelString },
        },
        ...(reviewDetails.classificationReviewReason
          ? [
              {
                key: { text: 'Override reason' },
                value: { text: reviewDetails.classificationReviewReason },
              },
            ]
          : []),
        ...(reviewDetails.approvalCommitteeName
          ? [
              {
                key: { text: 'Authorised by' },
                value: { text: reviewDetails.approvalCommitteeName },
              },
            ]
          : []),
        {
          key: { text: 'Location', classes: 'govuk-!-padding-top-6' },
          value: { text: agencyDetails.description || notEnteredMessage },
        },
        {
          key: { text: 'Comments' },
          value: { text: reviewDetails.assessmentComment || notEnteredMessage },
        },
        {
          key: { text: 'Reviewed by' },
          value: { text: formatName(staffDetails.firstName, staffDetails.lastName) },
        },
        {
          key: { text: 'Next review date' },
          value: { text: formatTimestampToDate(reviewDetails.nextReviewDate) },
        },
      ],
      profileUrl: `/prisoner/${offenderNo}`,
      reviewDate: formatTimestampToDate(reviewDetails.assessmentDate),
      reviewQuestions: reviewDetails.questions,
    })
  } catch (error) {
    res.locals.redirectUrl = `/prisoner/${offenderNo}`
    throw error
  }
}
