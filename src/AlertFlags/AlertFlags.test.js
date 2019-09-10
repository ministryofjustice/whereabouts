import React from 'react'
import { shallow } from 'enzyme'
import AlertFlags from './AlertFlags'

describe('<AlertFlags />', () => {
  it('should not render without any AlertFlags or categories', () => {
    const wrapper = shallow(<AlertFlags />)

    expect(wrapper.type()).toBe(null)
  })

  it('should display the DISABILITY (PEEP) flag', () => {
    const wrapper = shallow(<AlertFlags alerts={['PEEP']} />)
    const flag = wrapper
      .find('Flag')
      .shallow()
      .find('.disability-status')

    expect(flag.text()).toEqual('PEEP')
  })

  it('should display the ACCT (HA) flag', () => {
    const wrapper = shallow(<AlertFlags alerts={['HA']} />)
    const flag = wrapper
      .find('Flag')
      .shallow()
      .find('.acct-status')

    expect(flag.text()).toEqual('ACCT')
  })

  it('should display the E-LIST (XEL) flag', () => {
    const wrapper = shallow(<AlertFlags alerts={['XEL']} />)
    const flag = wrapper
      .find('Flag')
      .shallow()
      .find('.elist-status')

    expect(flag.text()).toEqual('E-LIST')
  })

  it('should show CAT A flag for category A', () => {
    const wrapper = shallow(<AlertFlags category="A" />)
    const flag = wrapper
      .find('Flag')
      .shallow()
      .find('.cata-status')

    expect(flag.text()).toEqual('CAT A')
  })

  it('should show CAT A flag for category E', () => {
    const wrapper = shallow(<AlertFlags category="E" />)
    const flag = wrapper
      .find('Flag')
      .shallow()
      .find('.cata-status')

    expect(flag.text()).toEqual('CAT A')
  })

  it('should show CAT A High flag for category H', () => {
    const wrapper = shallow(<AlertFlags category="H" />)
    const flag = wrapper
      .find('Flag')
      .shallow()
      .find('.cata-high-status')

    expect(flag.text()).toEqual('CAT A High')
  })

  it('should show CAT A Prov flag for category P', () => {
    const wrapper = shallow(<AlertFlags category="P" />)
    const flag = wrapper
      .find('Flag')
      .shallow()
      .find('.cata-prov-status')

    expect(flag.text()).toEqual('CAT A Prov')
  })
})
