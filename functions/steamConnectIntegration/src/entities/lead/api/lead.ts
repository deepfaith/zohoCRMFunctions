import axios, { AxiosResponse } from 'axios';
import {accessToken} from "../../../config";

/**
 * Gets a lead by ID from Zoho CRM.
 *
 * @param {string} leadId - The ID of the lead to retrieve.
 * @returns {Promise<any>} - A promise that resolves to the lead data, or null if the request fails.
 */
export const getLeadById = async (leadId: string): Promise<any> => {
  const url = `https://www.zohoapis.com/crm/v2/Leads/${leadId}`;

  try {
    const response: AxiosResponse<any> = await axios.get(url, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    });

    if (response.status === 200) {
      console.log('Lead Data:', response.data);
      return response.data;
    } else {
      console.error('Failed to retrieve lead:', response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error while retrieving lead:', error);
    return null;
  }
};
