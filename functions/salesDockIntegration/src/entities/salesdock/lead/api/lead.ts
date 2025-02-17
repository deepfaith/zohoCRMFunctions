import axios, { AxiosResponse } from "axios";
import { salesDockUrl } from "../../../../config";

/**
 * Creates a new lead in Salesdock.
 *
 * @param {any} data - The lead data to create.
 * @returns {Promise<any>} - A promise that resolves to the created lead data.
 */
export const createLeadInSalesdock = async (
  data: any,
  salesDockApiKey: string,
): Promise<any> => {
  const response: AxiosResponse<any> = await axios.post(
    `${salesDockUrl}/leads`,
    {
      company: data.company,
      lastName: data.last_name,
      email: data.email,
    },
    {
      headers: { Authorization: `Bearer ${salesDockApiKey}` },
    },
  );
  return response.data;
};

/**
 * Updates a lead in Salesdock.
 *
 * @param {any} data - The lead data to update.
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
