import axios, { AxiosResponse } from "axios";
import FormData from "form-data";
import DataStoreService from "./dataStoreService";
import LoggingService from "./loggingService";

/**
 * Service class for Zoho OAuth authentication.
 */
class ZohoAuthService {
  private dataStoreService: DataStoreService;
  private loggingService: LoggingService;
  private orgId: string;
  private catalystApp: any;
  private token: any;

  constructor(orgId: string, catalystApp: any) {
    this.orgId = orgId;
    this.token = null;
    this.catalystApp = catalystApp;
    this.dataStoreService = new DataStoreService(this.orgId, this.catalystApp);
    this.loggingService = new LoggingService(this.orgId, this.catalystApp);
  }

  /**
   * Initializes the access and refresh tokens from the Data Store.
   */
  public initializeTokens = async (): Promise<void> => {
    try {
      const token = await this.dataStoreService.getAccessTokens();
      if (!token) throw new Error("Error getting tokens from Data Store");

      this.token = token;
      await this.loggingService.createLog(
        "initializeTokens",
        "Initializes the access and refresh tokens from the Data Store",
        "SUCCESS",
        this.token,
      );
    } catch (error) {
      const errorMessage = `Error initializing tokens from Data Store: ${(error as Error).message}`;
      console.error(errorMessage);
      await this.loggingService.createLog(
        "initializeTokens",
        errorMessage,
        "ERROR",
        { org_id: this.orgId },
      );
      throw new Error(errorMessage);
    }
  };

  /**
   * Updates the tokens in the Data Store.
   */
  private updateTokensInDataStore = async (): Promise<void> => {
    try {
      await this.dataStoreService.updateAccessTokens(
        this.token,
        this.token.access_token,
      );
      await this.loggingService.createLog(
        "updateTokensInDataStore",
        "Tokens updated in Data Store",
        "SUCCESS",
        this.token,
      );
    } catch (error) {
      const errorMessage = `Error updating tokens in Data Store: ${(error as Error).message}`;
      console.error(errorMessage);
      await this.loggingService.createLog(
        "updateTokensInDataStore",
        errorMessage,
        "ERROR",
        this.token,
      );
      throw new Error(errorMessage);
    }
  };

  /**
   * Renews the access token using the refresh token.
   *
   * @returns A promise that resolves to the new access token.
   */
  public renewAccessToken = async (): Promise<string> => {
    const url = "https://accounts.zoho.com/oauth/v2/token";
    const formData = new FormData();
    formData.append("client_id", this.token.client_id);
    formData.append("client_secret", this.token.client_secret);
    formData.append("refresh_token", this.token.refresh_token);
    formData.append("grant_type", "refresh_token");

    try {
      const response = await axios.post(url, formData, {
        headers: formData.getHeaders(),
      });

      if (response.status === 200) {
        this.token.access_token = response.data.access_token || "";
        await this.loggingService.createLog(
          "initializeTokens",
          "Access Token renewed:",
          "SUCCESS",
          this.token,
        );

        if (!response.data.access_token)
          throw new Error("Failed to renew access token from API");

        // Update tokens in the Data Store
        await this.updateTokensInDataStore();

        return this.token.access_token;
      } else {
        console.error(
          "Failed to renew access token:",
          response.status,
          response.statusText,
        );
        throw new Error("Failed to renew access token");
      }
    } catch (error) {
      const errorMessage = `Error while renewing access token: ${(error as Error).message}`;
      console.error(errorMessage);
      await this.loggingService.createLog(
        "renewAccessToken",
        errorMessage,
        "ERROR",
        formData,
      );
      throw new Error(errorMessage);
    }
  };

  public getAccessTokens = (): any => {
    return this.token;
  };
  public getAccessToken = (): string => {
    return this.token.access_token;
  };

  public getDataStoreService = (): DataStoreService => {
    return this.dataStoreService;
  };

  public getLoggingService = (): LoggingService => {
    return this.loggingService;
  };
}

export default ZohoAuthService;
