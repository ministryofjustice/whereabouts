import styled from 'react-emotion'
import Select from '@govuk-react/select'
import TextArea from '@govuk-react/text-area'

import { BREAKPOINTS, FONT_SIZE, SPACING } from '@govuk-react/constants'

export const HorizontallyStacked = styled('div')`
  display: flex;
  flex-direction: row;

  div:first-child {
    margin-right: 5px;
  }
`
export const Container = styled('div')`
  display: flex;
  flex-direction: row;

  @media (max-width: ${BREAKPOINTS.LARGESCREEN}) {
    flex-direction: column;
  }
`

export const RightSection = styled('div')`
  flex: 1;
  max-width: 40%;
  padding-left: 120px;

  @media (max-width: ${BREAKPOINTS.LARGESCREEN}) {
    padding-left: 0;
    margin-bottom: ${SPACING.SCALE_4};
    max-width: 100%;
  }
`

export const ButtonContainer = styled('div')`
  display: flex;
  flex-direction: row;
  button {
    margin-right: ${SPACING.SCALE_2};
  }
`

export const FullWidthSelect = styled(Select)`
  select {
    width: 100% !important;
  }
`
export const FullWidthTextArea = styled(TextArea)`
  textarea {
    width: 100% !important;
  }
`

export const Table = styled('table')`
  th,
  td {
    font-size: ${FONT_SIZE.SIZE_19} !important;
    @media (max-width: ${BREAKPOINTS.LARGESCREEN}) {
      font-size: ${FONT_SIZE.SIZE_16} !important;
    }
  }
`
