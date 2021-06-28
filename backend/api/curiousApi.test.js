const { curiousApiFactory, dummyLearnerProfiles, dummyFunctionalSkillsLevels } = require('./curiousApi')

const curiousApi = curiousApiFactory()

describe('curiousApi', () => {
  describe('getLearnerProfiles', () => {
    it('should return the expected response data', async () => {
      const actual = await curiousApi.getLearnerProfiles()
      expect(actual).toEqual(dummyLearnerProfiles)
    })
  })
  describe('getLearnerLatestAssessments', () => {
    it('should return the expected response data', async () => {
      const actual = await curiousApi.getLearnerLatestAssessments()
      expect(actual).toEqual(dummyFunctionalSkillsLevels)
    })
  })
})
