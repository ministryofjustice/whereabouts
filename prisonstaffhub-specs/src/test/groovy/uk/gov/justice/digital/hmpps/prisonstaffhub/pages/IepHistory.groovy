package uk.gov.justice.digital.hmpps.prisonstaffhub.pages

import geb.Page

class IepHistory  extends Page {
    static url = '/offenders/A1234AC/iep-history'

    static at = {
        pageTitle == 'IEP level'
    }

    static content = {
        pageTitle { $('.inner-content h1').text() }
        tableRows { $('tbody tr') }
        labels { $'.label' }
        currentIepLevelData { $('p')}
    }
}