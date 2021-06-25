const { curiousApiFactory, dummyLearnerProfiles, dummyFunctionalSkillsLevels } = require('./curiousApi')

const curiousApi = curiousApiFactory()

describe('curiousApi', () => {
  describe('getLearnerProfiles', () => {
    it('should return the expected response data', async () => {
      const actual = await curiousApi.getLearnerProfiles()
      expect(actual).toEqual(dummyLearnerProfiles)
    })
  })
  describe('getFunctionalSkillsLevels', () => {
    it('should return the expected response data', async () => {
      const actual = await curiousApi.getFunctionalSkillsLevels()
      expect(actual).toEqual(dummyFunctionalSkillsLevels)
    })
  })
})
