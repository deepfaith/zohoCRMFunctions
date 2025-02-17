import axios, { AxiosResponse } from "axios";
import { zohoUrl } from "../../../../config";
import zohoAuthService from "../../../../services/zohoAuthService";

/**
 * Gets a lead by ID from Zoho CRM.
 *
 * @param {zohoAuthService} authService - The ZohoAuthService instance to manage authentication.
 * @param {string} leadId - The ID of the lead to retrieve.
 * @returns {Promise<any>} - A promise that resolves to the lead data, or null if the request fails.
 */
export const getLeadById = async (
  authService: zohoAuthService,
  leadId: string,
): Promise<any> => {
  const url = `${zohoUrl}/Leads/${leadId}`;
  let accessToken = authService.getAccessToken();

  let retry = false;

  do {
    try {
      if (!accessToken) throw new Error("Failed to access token");
      const response: AxiosResponse<any> = await axios.get(url, {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      });

      if (response.status === 200) {
        return response.data.data[0];
      } else {
        console.error(
          "Failed to retrieve lead:",
          response.status,
          response.statusText,
        );
        return null;
      }
    } catch (error: any) {
      console.warn(
        "Invalid access token, renewing...",
        (error as Error).message,
      );
      accessToken = await authService.renewAccessToken();
      retry = true;
    }
  } while (retry);
};
