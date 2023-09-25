const { DIRECTIONS, NUMBER_OF_REPEATS } = require("../constants");
const { saveStat } = require("../services/stat.service");

/**
 * Check that dna sent via request body is a Mutation
 * @param {Request} req Http Request Express Object
 * @param {Response} res Http Response Express Object
 * @param {Function} next Next function to be executed if called
 * @returns Response depending on the mutation algorithm
 *  200 OK - There is a mutation on sent DNA
 *  400 Bad Request - There is something wrong with the request body
 *  403 Not Authorized - There is not mutation on sent DNA (Personal note: This status is not for this)
 *  500 Server Error - Something else is broken
 */
const postCheckMutation = async (req, res, next) => {
  try {
    // Extract dna from request body
    const { dna } = req.body || [];

    // Iterate DNA
    const isMutant = iterateAndCheckDna(dna);

    // Insert into database and return response
    await saveStat(isMutant);
    if (isMutant) return res.status(200).json({ isMutant });
    else return res.status(403).end(); // This can also be thrown as an error and error middleware will catch this
  } catch (err) {
    next(err);
  }
};

/**
 * Iterate through a Matrix of Strings and search for mutations.
 * A mutation is a sequence of N repeated gens by any straight direction (right, bottom or oblicuous)
 * @param {[][] String} dna
 * @returns {boolean} Indicator if there is a mutation in DNA
 */
const iterateAndCheckDna = (dna) => {
  let isMutant = false;
  for (let i = 0; i < dna.length && !isMutant; i++) {
    for (let j = 0; j < dna[i].length && !isMutant; j++) {
      const searchedGen = dna[i][j];

      // Right direction
      if (j + 1 < dna[i].length && j + NUMBER_OF_REPEATS < dna[i].length) {
        // Partial iteration
        isMutant =
          isMutant ||
          searchRepeatedGen(dna, i, j + 1, searchedGen, DIRECTIONS.RIGHT);
      }
      // Bottom direction
      if (i + 1 < dna.length && i + NUMBER_OF_REPEATS < dna.length) {
        isMutant =
          isMutant ||
          searchRepeatedGen(dna, i + 1, j, searchedGen, DIRECTIONS.BOTTOM);
      }

      // Right up direction
      if (
        i - 1 >= 0 &&
        j + 1 < dna[i].length &&
        i - NUMBER_OF_REPEATS >= 0 &&
        j + NUMBER_OF_REPEATS < dna[i].length
      ) {
        isMutant =
          isMutant ||
          searchRepeatedGen(
            dna,
            i - 1,
            j + 1,
            searchedGen,
            DIRECTIONS.RIGHT_UP
          );
      }

      // Right bottom direction
      if (i + 1 < dna.length && j + 1 < dna[i].length) {
        isMutant =
          isMutant ||
          searchRepeatedGen(
            dna,
            i + 1,
            j + 1,
            searchedGen,
            DIRECTIONS.RIGHT_BOTTOM
          );
      }
    }
  }
  return isMutant;
};

/**
 * Recursive function that depending on direction keeps checking for repeatedGen
 * @param {[][] String} dna Matrix of gens
 * @param {int} i Current vertical index
 * @param {int} j Current horizontal index
 * @param {String} repeatedGen Gen to be searched
 * @param {String} direction Direction to search and iterate recursively
 * @param {Number} repeats Number of repeats to break down algorithm
 * @returns {boolean} Indicator if there is a mutation on given positions and given direction
 */
const searchRepeatedGen = (dna, i, j, repeatedGen, direction, repeats = 1) => {
  // First break case, the actual gen is not the one we searching for

  if (dna[i][j] !== repeatedGen) return false;

  // Check if we have a repeated gen
  if (dna[i][j] === repeatedGen) repeats++;

  // Second break case, we have enough repeats
  if (repeats === NUMBER_OF_REPEATS) return true;

  // Check to the right
  if (direction === DIRECTIONS.RIGHT) {
    if (j + 1 < dna[i].length) {
      return searchRepeatedGen(dna, i, j + 1, repeatedGen, direction, repeats);
    } else return false;
  }

  // Check to the bottom
  else if (direction === DIRECTIONS.BOTTOM) {
    if (i + 1 < dna.length) {
      return searchRepeatedGen(dna, i + 1, j, repeatedGen, direction, repeats);
    } else return false;
  }

  // Check to the right up direction
  else if (direction === DIRECTIONS.RIGHT_UP) {
    if (i - 1 >= 0 && j + 1 < dna[i].length) {
      return searchRepeatedGen(
        dna,
        i - 1,
        j + 1,
        repeatedGen,
        direction,
        repeats
      );
    } else return false;
  }

  // Check to the right bottom direction
  else if (direction === DIRECTIONS.RIGHT_BOTTOM) {
    if (i + 1 < dna.length && j + 1 < dna[i].length) {
      return searchRepeatedGen(
        dna,
        i + 1,
        j + 1,
        repeatedGen,
        direction,
        repeats
      );
    } else return false;
  }
};

module.exports = { postCheckMutation };
