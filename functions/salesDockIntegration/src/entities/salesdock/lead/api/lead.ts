import axios, { AxiosResponse } from "axios";
import { salesDockUrl } from "../../../../config";

/**
 * Creates a new lead in Salesdock.
 *
 * @param {any} data - The lead data to create.
 * @param salesDockApiKey
 * @returns {Promise<any>} - A promise that resolves to the created lead data.
 */
export const createLeadInSalesdock = async (
  data: any,
  salesDockApiKey: string,
): Promise<any> => {
  try {
    const reqData = JSON.stringify(data);
    const response = await axios.post(`${salesDockUrl}/leads`, reqData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${salesDockApiKey}`,
      },
    });
    return { responseStatus: 1, ...response.data };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Handle non-fatal API errors (e.g., validation errors, unauthorized, etc.)
        console.warn(
          `API responded with status ${error.response.status}:`,
          error.response.data,
        );
        return { responseStatus: 0, ...error.response.data };
      }
    }
    const errorMessage = `Error while creating a lead to salesDock: ${(error as Error).message}`;
    console.error(errorMessage, error);
    throw new Error(errorMessage);
  }
};

/**
 * Updates a lead in Salesdock.
 *
 * @param {any} data - The lead data to update.
 * @param salesDockApiKey
 * @returns {Promise<any>} - A promise that resolves to the updated lead data.
 */
export const updateLeadInSalesdock = async (
  data: any,
  salesDockApiKey: string,
): Promise<any> => {
  const response: AxiosResponse<any> = await axios.put(
    `${salesDockUrl}/leads/${data.lead_id}`,
    {
      status: data.new_status,
    },
    {
      headers: { Authorization: `Bearer ${salesDockApiKey}` },
    },
  );
  return response.data;
};

/**
 * Converts a lead to a customer in Salesdock.
 *
 * @param {any} data - The lead data to convert.
 * @param salesDockApiKey
 * @returns {Promise<any>} - A promise that resolves to the converted customer data.
 */
export const convertLeadToCustomer = async (
  data: any,
  salesDockApiKey: string,
): Promise<any> => {
  const response: AxiosResponse<any> = await axios.post(
    `${salesDockUrl}/leads/${data.lead_id}/convert`,
    {},
    {
      headers: { Authorization: `Bearer ${salesDockApiKey}` },
    },
  );
  return response.data;
};
