import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
const BASE_URL = 'https://reqres.in';

export let options = {
  vus: 1000,
  iterations: 3500,
  thresholds: {
    'http_req_duration{job:POST}': ['avg <2000'], // Toleransi respons POST maksimum 2 detik
    'http_req_duration{job:PUT}': ['avg <0.1'],  // Toleransi respons PUT maksimum 2 detik
  },
};

    export default function () {
      const name = 'morpheus'
      const job = 'Zion resident'
      group ('API Create',function () {
        const FULL_URL = BASE_URL + '/api/users';
        const payload = JSON.stringify({
            name : name,
            job : job
           })
            const params = {
               headers: {
                 'content-Type' : 'application/json',
               },
           };

    let res = http.post(FULL_URL, payload, params);

        check(res, {
            'respone code was 201': (res) => res.status == 201,
        });
        check (res, {
            'response name should same with request': (res) =>{
                const response = JSON.parse(res.body);
                return response.name === name;
            },
        });
        check (res, {
            'response job should same with request': (res) =>{
                const response = JSON.parse(res.body);
                return response.job === job;
            },
        });
      });
    sleep(1);

         group ('API Update',function () {
            const FULL_URL = BASE_URL + '/api/users/2';
            const payload = JSON.stringify({
                name : name,
                job : job
               })
                const params = {
                   headers: {
                     'content-Type' : 'application/json',
                   },
               };

        let res = http.put(FULL_URL, payload, params);

            check(res, {
                'respone code was 200': (res) => res.status == 200,
            });
            check (res, {
                'response name should same with request': (res) =>{
                    const response = JSON.parse(res.body);
                    return response.name === name;
                },
            });
            check (res, {
                'response job should same with request': (res) =>{
                    const response = JSON.parse(res.body);
                    return response.job === job;
                },
            });
          });
          sleep(1);
        }



  export function handleSummary(data) {
    return {
      "summary.html": htmlReport(data),
    };
  }




