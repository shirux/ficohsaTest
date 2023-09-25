const { countByMutationFilter } = require("../services/stat.service");

/**
 * Retrieve the stats from dna checks and calculates its ratio
 * @param {Request} req Http Request Express Object
 * @param {Response} res Http Response Express Object
 * @param {Function} next Next function to be executed if called
 * @returns Response
 *  200 OK - Object with count properties for human and mutant and the ratio between these
 *  500 Server error - Something else is broken
 */
const getMutationStats = async (req, res, next) => {
  try {
    // Generate promises
    const mutantCountPromise = countByMutationFilter(true);
    const humanCountPromise = countByMutationFilter(false);
    const promisesArray = [mutantCountPromise, humanCountPromise];

    // Await promises
    const [mutantCount, humanCount] = await Promise.all(promisesArray);

    // Calculates ratio
    let ratio = "Not calculated";
    if (humanCount !== 0) ratio = mutantCount / humanCount;

    // Response
    return res.json({
      count_mutant_dna: mutantCount,
      count_human_dna: humanCount,
      ratio,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMutationStats };
