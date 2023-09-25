const { Stat } = require("../models");

/**
 * Count number of documents filtered by isMutant property
 * @param {boolean} isMutant Indicator to be filtered
 * @returns {int} Number of documents that fulfill the filter
 */
const countByMutationFilter = async (isMutant) => {
  try {
    const count = await Stat.countDocuments({ isMutant });
    return count;
  } catch (err) {
    throw err;
  }
};

/**
 * Save a new stat into database
 * @param {boolean} isMutant
 * @returns {Mongoose Stat Object} New saved stat
 */
const saveStat = async (isMutant) => {
  try {
    const newStat = new Stat({ isMutant });
    return await newStat.save();
  } catch (err) {
    throw err;
  }
};

module.exports = {
  countByMutationFilter,
  saveStat,
};
