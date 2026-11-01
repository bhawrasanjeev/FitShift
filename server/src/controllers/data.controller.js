import datasetService from '../services/dataset.service.js';

/**
 * Controller to handle dataset status endpoint.
 * Returns concise summary of dataset availability and validation status.
 * Never exposes filesystem paths or raw data arrays.
 */
export const getDataStatus = (req, res, next) => {
  try {
    const statusData = datasetService.getDatasetStatus();
    res.status(200).json({
      success: true,
      data: statusData
    });
  } catch (err) {
    next(err);
  }
};
