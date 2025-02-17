interface TokenRecord {
  ROWID?: string;
  access_token: string;
  updated_at: string;
  client_id: string;
  client_secret: string;
  refresh_token: string;
  salesdock_api_token: string;
}

class DataStoreService {
  private orgId: string;
  private catalystApp: any;
  private dataStore: any;
  private tokensTable: any;
  private zcql: any;

  constructor(orgId: string, catalystApp: any) {
    this.orgId = orgId;
    this.catalystApp = catalystApp;
    this.dataStore = this.catalystApp.datastore();
    this.zcql = this.catalystApp.zcql();
    this.tokensTable = this.dataStore.table("Tokens");
  }

  public getAccessTokens = async (): Promise<TokenRecord | null> => {
    try {
      const query = `SELECT * FROM Tokens WHERE org_id = '${this.orgId}' LIMIT 1`;
      const tokens = await this.zcql.executeZCQLQuery(query);
      return tokens.length > 0 ? tokens[0].Tokens : null;
    } catch (error) {
      console.error("Error fetching access tokens:", (error as Error).message);
      throw new Error("Failed to fetch access tokens from Data Store");
    }
  };

  public insertAccessTokens = async (
    record: TokenRecord,
    accessToken: string,
  ): Promise<void> => {
    try {
      const deleteQuery = `DELETE FROM Tokens WHERE org_id = '${this.orgId}'`;
      await this.zcql.executeZCQLQuery(deleteQuery);
      await this.tokensTable.insertRow({
        ...record,
        access_token: accessToken,
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error inserting access tokens:", (error as Error).message);
      throw new Error("Failed to insert access tokens into Data Store");
    }
  };

  public updateAccessTokens = async (
    record: TokenRecord,
    accessToken: string,
  ): Promise<void> => {
    try {
      await this.tokensTable.updateRow({
        ROWID: record.ROWID,
        access_token: accessToken,
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating access tokens:", (error as Error).message);
      throw new Error("Failed to update access tokens in Data Store");
    }
  };

  public getTokensTable = (): any => {
    return this.tokensTable;
  };
}

export default DataStoreService;
