import axios from 'axios';
import * as https from 'https';

const getGroupsUrl: string = 'https://university.kubsau.ru/kubsau/hs/csData/GetByGroup/';
const username = 'ws';
const password = '1';
const token = 'hi9318jdmi32odMoiwjd2owc';

type FetchProps = {
  groupID: string
}

export const fetchScheduleFromUniversityAPI = async ({ groupID }: FetchProps) => {
  try {
    const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');

    const response = await axios.get(getGroupsUrl + groupID, {
      headers: {
        'Content-Type': 'application/json',
        'Token': token,
        'Authorization': `Basic ${basicAuth}`
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Отключение проверки сертификата
    });

    if (response.status !== 200) {
      throw new Error('Ошибка запроса к серверу КубГАУ');
    }

    return response.data;
  } catch (err: any) {
    return err;
  }
};
