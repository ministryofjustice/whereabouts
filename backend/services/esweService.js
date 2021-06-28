const { app } = require('../config')
const { readableDateFormat } = require('../utils')

/**
 * Education skills and work experience (ESWE)
 */
class EsweService {
  #curiousApi = null

  #prisonApi = null

  static create(curiousApi, prisonApi) {
    return new EsweService(curiousApi, prisonApi)
  }

  /**
   * The curiousApi is currently providing mock data
   * However this provides a stub in preparation
   * for the full api integration
   *
   * @param curiousApi
   * @param prisonApi
   */
  constructor(curiousApi, prisonApi) {
    this.#curiousApi = curiousApi
    this.#prisonApi = prisonApi
  }

  async getLearnerProfiles(nomisId) {
    if (!app.esweEnabled) {
      return {
        enabled: app.esweEnabled,
        content: [],
      }
    }

    const content = await this.#curiousApi.getLearnerProfiles(nomisId)

    return {
      enabled: app.esweEnabled,
      content,
    }
  }

  async getFunctionalSkillsLevels(nomisId) {
    if (!app.esweEnabled) {
      return {
        enabled: app.esweEnabled,
        content: [],
      }
    }

    const content = await this.#curiousApi.getFunctionalSkillsLevels(nomisId)

    const filterSkillsAndGetLatestGrade = (functionalSkillLevels, skillToFilter) =>
      functionalSkillLevels[0].qualifications
        .filter(functionalSkillLevel => functionalSkillLevel.qualification.qualificationType === skillToFilter)
        .sort((a, b) => new Date(b.qualification.assessmentDate) - new Date(a.qualification.assessmentDate))[0]

    const englishSkillLevels = filterSkillsAndGetLatestGrade(content, 'English') || { skill: 'English/Welsh' }
    const mathsSkillLevels = filterSkillsAndGetLatestGrade(content, 'Maths') || { skill: 'Maths' }
    const digiLitSkillLevels = filterSkillsAndGetLatestGrade(content, 'Digital Literacy') || {
      skill: 'Digital Literacy',
    }

    const createSkillAssessmentSummary = skillAssessment => {
      if (!skillAssessment.qualification) return [{ label: skillAssessment.skill, value: 'Awaiting assessment' }]

      const { qualificationType, qualificationGrade, assessmentDate } = skillAssessment.qualification
      const { establishmentName } = skillAssessment

      return [
        {
          label: qualificationType === 'English' ? 'English/Welsh' : qualificationType,
          value: qualificationGrade,
        },
        {
          label: 'Assessment Date',
          value: readableDateFormat(assessmentDate, 'YYYY-MM-DD'),
        },
        {
          label: 'Location',
          value: establishmentName,
        },
      ]
    }

    const functionalSkillLevels = {
      english: createSkillAssessmentSummary(englishSkillLevels),
      maths: createSkillAssessmentSummary(mathsSkillLevels),
      digiLit: createSkillAssessmentSummary(digiLitSkillLevels),
    }

    return {
      enabled: app.esweEnabled,
      content: functionalSkillLevels,
    }
  }
}

module.exports = EsweService
