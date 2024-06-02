import axios from 'axios';
import { sepolia } from '../models/Chain';



export class TransactionService {

  static API_URL =  'https://deep-index.moralis.io/api/v2';
  static API_KEY =  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjA3NzU3YTJhLTNkMmMtNDhjOS04YTM2LTJlZjUxZDhhYzY0OSIsIm9yZ0lkIjoiMzk0NTU0IiwidXNlcklkIjoiNDA1NDMxIiwidHlwZUlkIjoiNjY1NWY4ZmItMjZjOC00YmE4LWI5NWQtYTM4MTdjYzFhMWQ1IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTcyNDQ3MjYsImV4cCI6NDg3MzAwNDcyNn0.Cd8N8R-pu2GRbB3v3Dp56EKK9rd2zApeU3bEROnyoNc';

  static async getTransactions(address: string) {
    const options = {
        method: 'GET',
        url: `${TransactionService.API_URL}/${address}`,
        params: {chain: sepolia.name.toLowerCase()},
        headers: {accept: 'application/json', 'X-API-Key': TransactionService.API_KEY}
      };

    const response = await axios.request(options);
    return response;
  }

}