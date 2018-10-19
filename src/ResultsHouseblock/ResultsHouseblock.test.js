import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import { ResultsHouseblock } from "./ResultsHouseblock";
import OtherActivitiesView from "../OtherActivityListView";

const PRISON = 'LEI';

const OFFENDER_NAME_COLUMN = 0;
const LOCATION_COLUMN = 1;
const NOMS_ID_COLUMN = 2;
const MAIN_COLUMN = 3;
const OTHER_COLUMN = 4;
const ATTEND_COLUMN = 5;
const DONT_ATTEND_COLUMN = 6;

const response = [
  {
    releaseScheduled: true,
    activity: {
      offenderNo: "A1234AA",
      firstName: "ARTHUR",
      lastName: "ANDERSON",
      cellLocation: `${PRISON}-A-1-1`,
      event: "PA",
      eventId: 56,
      eventType: "PRISON_ACT",
      eventDescription: "Prison Activities",
      comment: "Chapel",
      startTime: "2017-10-15T18:00:00",
      endTime: "2017-10-15T18:30:00"
    },
    others: [{
      offenderNo: "A1234AA",
      firstName: "ARTHUR",
      lastName: "ANDERSON",
      cellLocation: `${PRISON}-A-1-1`,
      event: "VISIT",
      eventDescription: "Visits",
      comment: "Official Visit",
      startTime: "2017-10-15T11:00:00",
      endTime: "2017-10-15T11:30:00"
    },
    {
      offenderNo: "A1234AA",
      firstName: "ARTHUR",
      lastName: "ANDERSON",
      cellLocation: `${PRISON}-A-1-1`,
      event: "APP",
      eventDescription: "The gym, appointment",
      comment: "",
      startTime: "2017-10-15T17:00:00",
      endTime: "2017-10-15T17:30:00"
    },
    {
      offenderNo: "A1234AA",
      firstName: "ARTHUR",
      lastName: "ANDERSON",
      cellLocation: `${PRISON}-A-1-1`,
      comment: "Appt details",
      event: "MEDE",
      eventDescription: "Medical - Dentist",
      startTime: "2018-06-18T11:40:00"
    }]
  },
  {
    activity: {
      offenderNo: "A1234AB",
      firstName: "MICHAEL",
      lastName: "SMITH",
      cellLocation: `${PRISON}-A-1-2`,
      event: "PA",
      eventType: "PRISON_ACT",
      eventDescription: "Prison Activities",
      comment: "Chapel Act",
      startTime: "2017-10-15T18:00:00",
      endTime: "2017-10-15T18:30:00"
    }
  },
  {
    activity: {
      offenderNo: "A1234AC",
      firstName: "FRED",
      lastName: "QUIMBY",
      cellLocation: `${PRISON}-A-1-3`,
      event: "PA",
      eventType: "PRISON_ACT",
      eventDescription: "Prison Activities",
      comment: "Chapel Activity",
      startTime: "2017-10-15T18:00:00",
      endTime: "2017-10-15T18:30:00"
    },
    others: [
      {
        offenderNo: "A1234AC",
        firstName: "FRED",
        lastName: "QUIMBY",
        cellLocation: `${PRISON}-A-1-3`,
        event: "VISIT",
        eventStatus: 'CANC',
        eventDescription: "Visits",
        comment: "Family Visit",
        startTime: "2017-10-15T11:11:00",
        endTime: "2017-10-15T18:30:00"
      }
    ] }
];

const subLocations = ['1', '2'];

const user = { activeCaseLoadId: 'SYI', caseLoadOptions: [{ caseLoadId: 'XXX', description: 'Some Prison' }, { caseLoadId: 'SYI', description: 'Shrewsbury' }] };

describe('Offender results component Jira NN-843', () => {
  it('should render initial offender results form correctly', async () => {
    const aFewDaysAgo = moment().subtract(3, 'days');
    const date = aFewDaysAgo.format('DD/MM/YYYY');

    const component = shallow(<ResultsHouseblock
      agencyId={PRISON}
      currentLocation={'1'}
      currentSubLocation={'--'}
      date={date}
      getHouseblockList={jest.fn()}
      subLocations={subLocations}
      history={{ push: jest.fn() }}
      houseblockData={response}
      handleSearch={jest.fn()}
      handlePrint={jest.fn()}
      handleSubLocationChange={jest.fn()}
      handlePeriodChange={jest.fn()}
      handleDateChange={jest.fn()}
      handlePay={jest.fn()}
      period={'ED'}
      showPaymentReasonModal={jest.fn()}
      user={user}
      update={jest.fn()}
    />);
    expect(component.find('.whereabouts-title').text()).toEqual('1');

    const housingLocationSelect = component.find('#housing-location-select');
    expect(housingLocationSelect.some('[value="--"]')).toEqual(true);
    // Dig into the DatePicker component
    const searchDate = component.find('[additionalClassName="dateInputResults"]').shallow().shallow().shallow().find('input');
    expect(searchDate.some(`[value='${date}']`)).toEqual(true);
    const periodSelect = component.find('#period-select');
    expect(periodSelect.some('[value="ED"]')).toEqual(true);

    const tr = component.find('tr');
    expect(tr.length).toEqual(4); // 3 plus table header tr
    expect(tr.at(1).find('td a').at(OFFENDER_NAME_COLUMN).text()).toEqual('Anderson, Arthur');
    expect(tr.at(1).find('td').at(NOMS_ID_COLUMN).text()).toEqual('A1234AA');
    expect(tr.at(1).find('td').at(LOCATION_COLUMN).text()).toEqual('A-1-1');
    expect(tr.at(1).find('td').at(MAIN_COLUMN).text()).toEqual('Chapel 18:00');

    expect(tr.at(1).find('td').at(OTHER_COLUMN).find(OtherActivitiesView).at(0).dive().find('li').at(0).text()).toEqual('** Release scheduled **');
    expect(tr.at(1).find('td').at(OTHER_COLUMN).find(OtherActivitiesView).at(0).dive().find('li').at(1).text()).toEqual('Visits - Official Visit 11:00');
    expect(tr.at(1).find('td').at(OTHER_COLUMN).find(OtherActivitiesView).at(0).dive().find('li').at(2).text()).toEqual('The gym, appointment 17:00');
    expect(tr.at(1).find('td').at(OTHER_COLUMN).find(OtherActivitiesView).at(0).dive().find('li').at(3).text()).toEqual('Medical - Dentist - Appt details 11:40');
    // Check not disabled. This odd looking attribute value is handled correctly in the real DOM
    expect(tr.at(1).find('td').at(ATTEND_COLUMN).find('input').some('[type="checkbox"]')).toEqual(true);
    expect(tr.at(1).find('td').at(DONT_ATTEND_COLUMN).find('input').some('[type="checkbox"]')).toEqual(true);

    expect(tr.at(2).find('td a').at(OFFENDER_NAME_COLUMN).text()).toEqual('Smith, Michael');
    expect(tr.at(2).find('td').at(LOCATION_COLUMN).text()).toEqual('A-1-2');
    expect(tr.at(2).find('td').at(MAIN_COLUMN).text()).toEqual('Chapel Act 18:00');
    expect(tr.at(2).find('td').at(OTHER_COLUMN).find(OtherActivitiesView).at(0).dive().find('li').length).toEqual(0);

    expect(tr.at(3).find('td a').at(OFFENDER_NAME_COLUMN).text()).toEqual('Quimby, Fred');
    expect(tr.at(3).find('td').at(LOCATION_COLUMN).text()).toEqual('A-1-3');
    expect(tr.at(3).find('td').at(MAIN_COLUMN).text()).toEqual('Chapel Activity 18:00');
    expect(tr.at(3).find('td').at(OTHER_COLUMN).find(OtherActivitiesView).at(0).dive().find('li').at(0).text()).toEqual('Visits - Family Visit 11:11 (cancelled)');
  });

  it('should render empty results list correctly', async () => {
    const component = shallow(<ResultsHouseblock
      history={{ push: jest.fn() }}
      subLocations={subLocations}
      houseblockData={[]}
      handleSearch={jest.fn()}
      handlePrint={jest.fn()}
      handleSubLocationChange={jest.fn()}
      handlePeriodChange={jest.fn()}
      handleDateChange={jest.fn()}
      handlePay={jest.fn()}
      getHouseblockList={jest.fn()}
      period={'AM'}
      currentLocation={'BWing'}
      agencyId={PRISON}
      showPaymentReasonModal={jest.fn()}
      user={user}
      update={jest.fn()}
    />);
    const tr = component.find('tr');
    expect(tr.length).toEqual(1); // table header tr only
    expect(component.find('div.font-small').text()).toEqual('No prisoners found');
  });

  it('should handle buttons correctly', async () => {
    const update = jest.fn();
    const handlePrint = jest.fn();
    const today = moment().format('DD/MM/YYYY');
    const component = shallow(<ResultsHouseblock
      history ={{ push: jest.fn() }}
      subLocations={subLocations}
      houseblockData={response}
      handlePrint={handlePrint}
      handleSubLocationChange={jest.fn()}
      handlePeriodChange={jest.fn()}
      handleDateChange={jest.fn()}
      handlePay={jest.fn()}
      getHouseblockList={jest.fn()}
      date={today}
      period={'PM'}
      currentLocation={'BWing'}
      agencyId={PRISON}
      showPaymentReasonModal={jest.fn()}
      user={user}
      update={update}
    />);

    expect(component.find('#buttons > button').some('#printButton')).toEqual(true);

    component.find('#updateButton').simulate('click');
    expect(update).toHaveBeenCalled();
    expect(handlePrint).not.toHaveBeenCalled();
    expect(handlePrint).not.toHaveBeenCalled();

    component.find('#printButton').at(0).simulate('click');
    expect(handlePrint).toHaveBeenCalled();
  });

  it('should not display print button when date is not today', async () => {
    const handlePrint = jest.fn();
    const oldDate = '25/05/2018';
    const component = shallow(<ResultsHouseblock
      history ={{ push: jest.fn() }}
      subLocations={subLocations}
      houseblockData={response}
      handlePrint={handlePrint}
      handleSubLocationChange={jest.fn()}
      handlePeriodChange={jest.fn()}
      handleDateChange={jest.fn()}
      handlePay={jest.fn()}
      getHouseblockList={jest.fn()}
      date={oldDate}
      period={'ED'}
      currentLocation={'BWing'}
      agencyId={PRISON}
      showPaymentReasonModal={jest.fn()}
      user={user}
      update={jest.fn()}
    />);
    expect(component.find('#buttons > button').some('#printButton')).toEqual(false);
  });

  it('checkboxes should be read-only when date is over a week ago', async () => {
    const handlePrint = jest.fn();
    const oldDate = '23/05/2018';
    const component = shallow(<ResultsHouseblock
      history ={{ push: jest.fn() }}
      subLocations={subLocations}
      houseblockData={response}
      handlePrint={handlePrint}
      handleSubLocationChange={jest.fn()}
      handlePeriodChange={jest.fn()}
      handleDateChange={jest.fn()}
      handlePay={jest.fn()}
      getHouseblockList={jest.fn()}
      date={oldDate}
      period={'ED'}
      currentLocation={'BWing'}
      agencyId={PRISON}
      showPaymentReasonModal={jest.fn()}
      user={user}
      update={jest.fn()}
    />);

    const tr = component.find('tr');
    expect(tr.at(1).find('td').at(ATTEND_COLUMN).find('input').some('[disabled]')).toEqual(true);
    expect(tr.at(1).find('td').at(DONT_ATTEND_COLUMN).find('input').some('[disabled]')).toEqual(true);
  });

  it('should display the correct sorting headings for Location', async () => {
    const handlePrint = jest.fn();
    const today = moment().format('DD/MM/YYYY');
    const component = shallow(<ResultsHouseblock
      history ={{ push: jest.fn() }}
      subLocations={subLocations}
      houseblockData={response}
      handlePrint={handlePrint}
      handleSubLocationChange={jest.fn()}
      handlePeriodChange={jest.fn()}
      handleDateChange={jest.fn()}
      handlePay={jest.fn()}
      getHouseblockList={jest.fn()}
      date={today}
      period={'ED'}
      orderField={'cellLocation'}
      sortOrder={'ASC'}
      currentLocation={'BWing'}
      agencyId={PRISON}
      showPaymentReasonModal={jest.fn()}
      user={user}
      update={jest.fn()}
    />);

    expect(component.find('#Location-sort-asc').length).toEqual(1);
    expect(component.find('#Location-sort-desc').length).toEqual(0);
    expect(component.find('#Name-sort-desc').length).toEqual(0);
    expect(component.find('#Name-sort-asc').length).toEqual(0);
  });

  it('should display the correct sorting headings for Name', async () => {
    const handlePrint = jest.fn();
    const today = moment().format('DD/MM/YYYY');
    const component = shallow(<ResultsHouseblock
      history ={{ push: jest.fn() }}
      subLocations={subLocations}
      houseblockData={response}
      handlePrint={handlePrint}
      handleSubLocationChange={jest.fn()}
      handlePeriodChange={jest.fn()}
      handleDateChange={jest.fn()}
      handlePay={jest.fn()}
      getHouseblockList={jest.fn()}
      date={today}
      period={'ED'}
      orderField={'lastName'}
      sortOrder={'DESC'}
      currentLocation={'BWing'}
      agencyId={PRISON}
      showPaymentReasonModal={jest.fn()}
      user={user}
      update={jest.fn()}
    />);

    expect(component.find('#Location-sort-asc').length).toEqual(0);
    expect(component.find('#Location-sort-desc').length).toEqual(0);
    expect(component.find('#Name-sort-desc').length).toEqual(1);
    expect(component.find('#Name-sort-asc').length).toEqual(0);
  });

  it('should handle change of sort order', async () => {
    const getHouseblockList = jest.fn();
    const handlePrint = jest.fn();
    const today = moment().format('DD/MM/YYYY');

    const component = shallow(<ResultsHouseblock
      history ={{ push: jest.fn() }}
      subLocations={subLocations}
      houseblockData={response}
      handlePrint={handlePrint}
      handleSubLocationChange={jest.fn()}
      handlePeriodChange={jest.fn()}
      handleDateChange={jest.fn()}
      handlePay={jest.fn()}
      getHouseblockList={getHouseblockList}
      date={today}
      period={'ED'}
      orderField={'cellLocation'}
      sortOrder={'ASC'}
      currentLocation={'BWing'}
      agencyId={PRISON}
      showPaymentReasonModal={jest.fn()}
      user={user}
      update={jest.fn()}
    />);

    component.find('#Location-sort-asc').simulate('click');
    expect(getHouseblockList).toHaveBeenCalledWith('cellLocation', 'DESC');

    component.find('#Name-sortable-column').simulate('click');
    expect(getHouseblockList).toHaveBeenCalledWith('lastName', 'ASC');
  });

  it('should render back link', async () => {
    const component = shallow(<ResultsHouseblock
      history={{ push: jest.fn() }}
      subLocations={subLocations}
      houseblockData={[]}
      handlePrint={jest.fn()}
      handleSubLocationChange={jest.fn()}
      handlePeriodChange={jest.fn()}
      handleDateChange={jest.fn()}
      handlePay={jest.fn()}
      getHouseblockList={jest.fn()}
      period={'AM'}
      currentLocation={'BWing'}
      agencyId={PRISON}
      showPaymentReasonModal={jest.fn()}
      user={user}
      update={jest.fn()}
    />);
    expect(component.find('#back_to_selection_link').length).toEqual(1);
  });

  it('should show released today when there are no other activity', () => {
    const data = [{ releaseScheduled: true,
      activity: {
        offenderNo: "A1234AA",
        firstName: "ARTHUR",
        lastName: "ANDERSON",
        cellLocation: `${PRISON}-A-1-1`,
        event: "PA",
        eventId: 56,
        eventType: "PRISON_ACT",
        eventDescription: "Prison Activities",
        comment: "Chapel",
        startTime: "2017-10-15T18:00:00",
        endTime: "2017-10-15T18:30:00"
      }
    }];
    const aFewDaysAgo = moment().subtract(3, 'days');
    const date = aFewDaysAgo.format('DD/MM/YYYY');
    const component = shallow(<ResultsHouseblock
      history={{ push: jest.fn() }}
      subLocations={subLocations}
      houseblockData={data}
      handlePrint={jest.fn()}
      handleSubLocationChange={jest.fn()}
      handlePeriodChange={jest.fn()}
      handleDateChange={jest.fn()}
      handlePay={jest.fn()}
      getHouseblockList={jest.fn()}
      date={date}
      period={'ED'}
      currentLocation={'BWing'}
      agencyId={PRISON}
      showPaymentReasonModal={jest.fn()}
      user={user}
      update={jest.fn()}
    />);

    const tr = component.find('tr');
    expect(tr.at(1).find('td').at(OTHER_COLUMN).find(OtherActivitiesView).at(0).dive().find('li').at(0).text()).toEqual('** Release scheduled **');
  });

  it('Should render sub-locations in drop-down', () => {
    const component = shallow(<ResultsHouseblock
      history={{ push: jest.fn() }}
      subLocations={subLocations}
      houseblockData={[]}
      handlePrint={jest.fn()}
      handleSubLocationChange={jest.fn()}
      handlePeriodChange={jest.fn()}
      handleDateChange={jest.fn()}
      handlePay={jest.fn()}
      getHouseblockList={jest.fn()}
      date={moment().format('DD/MM/YYYY')}
      period={'ED'}
      currentLocation={'BWing'}
      agencyId={PRISON}
      showPaymentReasonModal={jest.fn()}
      user={user}
      update={jest.fn()}
    />);

    const options = component.find('#housing-location-select option');
    expect(options.length).toEqual(3);
    expect(options.contains(<option value="--">All</option>)).toEqual(true);
    expect(options.contains(<option value="1">1</option>)).toEqual(true);
    expect(options.contains(<option value="2">2</option>)).toEqual(true);
  });

  it('should show transfer scheduled in the other activities column', () => {
    const data = [{
      releasedToday: false,
      scheduledTransfers: [
        { eventId: 100, eventDescription: 'Transfer scheduled', scheduled: true }
      ],
      activity: {
        offenderNo: "A1234AA",
        firstName: "ARTHUR",
        lastName: "ANDERSON",
        cellLocation: `${PRISON}-A-1-1`,
        event: "PA",
        eventId: 56,
        eventType: "PRISON_ACT",
        eventDescription: "Prison Activities",
        comment: "Chapel",
        startTime: "2017-10-15T18:00:00",
        endTime: "2017-10-15T18:30:00"
      }
    }];
    const aFewDaysAgo = moment().subtract(3, 'days');
    const date = aFewDaysAgo.format('DD/MM/YYYY');

    const component = shallow(<ResultsHouseblock
      history={{ push: jest.fn() }}
      subLocations={subLocations}
      houseblockData={data}
      handlePrint={jest.fn()}
      handleSubLocationChange={jest.fn()}
      handlePeriodChange={jest.fn()}
      handleDateChange={jest.fn()}
      handlePay={jest.fn()}
      getHouseblockList={jest.fn()}
      date={date}
      period={'ED'}
      currentLocation={'BWing'}
      agencyId={PRISON}
      showPaymentReasonModal={jest.fn()}
      user={user}
      update={jest.fn()}
    />);

    const tr = component.find('tr');
    expect(tr.at(1).find('td').at(OTHER_COLUMN).find(OtherActivitiesView).at(0).dive().find('li').at(0).text()).toEqual('** Transfer scheduled ** ');
  });

  it('should show multiple scheduled transfers along with status description', () => {
    const data = [{
      releasedToday: false,
      scheduledTransfers: [
        { eventId: 100, eventDescription: 'Transfer scheduled', scheduled: true },
        { eventId: 101, eventDescription: 'Transfer scheduled', cancelled: true },
        { eventId: 102, eventDescription: 'Transfer scheduled', complete: true },
        { eventId: 103, eventDescription: 'Transfer scheduled', expired: true }
      ],
      activity: {
        offenderNo: "A1234AA",
        firstName: "ARTHUR",
        lastName: "ANDERSON",
        cellLocation: `${PRISON}-A-1-1`,
        event: "PA",
        eventId: 56,
        eventType: "PRISON_ACT",
        eventDescription: "Prison Activities",
        comment: "Chapel",
        startTime: "2017-10-15T18:00:00",
        endTime: "2017-10-15T18:30:00"
      }
    }];
    const aFewDaysAgo = moment().subtract(3, 'days');
    const date = aFewDaysAgo.format('DD/MM/YYYY');

    const component = shallow(<ResultsHouseblock
      history={{ push: jest.fn() }}
      subLocations={subLocations}
      houseblockData={data}
      handlePrint={jest.fn()}
      handleSubLocationChange={jest.fn()}
      handlePeriodChange={jest.fn()}
      handleDateChange={jest.fn()}
      handlePay={jest.fn()}
      getHouseblockList={jest.fn()}
      date={date}
      period={'ED'}
      currentLocation={'BWing'}
      agencyId={PRISON}
      showPaymentReasonModal={jest.fn()}
      user={user}
      update={jest.fn()}
    />);

    const transfers = component.find(OtherActivitiesView).dive().find('.transfer');

    expect(transfers.at(0).text()).toBe('** Transfer scheduled ** ');

    expect(transfers.at(1).text()).toBe('** Transfer scheduled ** (cancelled)');
    expect(transfers.at(1).find('span').last().getElement().props.className).toBe('cancelled');

    expect(transfers.at(2).text()).toBe('** Transfer scheduled ** (complete)');
    expect(transfers.at(2).find('span').last().getElement().props.className).toBe('complete');

    expect(transfers.at(3).text()).toBe('** Transfer scheduled ** (expired)');
    expect(transfers.at(3).find('span').last().getElement().props.className).toBe('cancelled');
  });

  // TODO Skipped for Part 1
  it.skip('should call showPaymentReasonModal with event and offender information', () => {
    const showPaymentReasonModal = jest.fn();

    const component = shallow(<ResultsHouseblock
      user={{}}
      houseblockData={[response[0]]}
      handlePrint={jest.fn()}
      handleSubLocationChange={jest.fn()}
      handlePeriodChange={jest.fn()}
      handleDateChange={jest.fn()}
      handlePay={jest.fn()}
      getHouseblockList={jest.fn()}
      showPaymentReasonModal={showPaymentReasonModal}
      update={jest.fn()}
    />);

    const browserEvent = {
      target: {
        value: 'dummy'
      }
    };
    component.find('#col4_0').last().simulate('change',
      browserEvent
    );

    expect(showPaymentReasonModal).toHaveBeenCalledWith(response[0].activity[0], browserEvent);
  });
});
