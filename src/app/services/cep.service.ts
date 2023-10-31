import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ViaCep } from '../models/via-cep';

@Injectable({
  providedIn: 'root'
})
export class CepService {
  constructor(private http: HttpClient) {}

  getAddressByCep(zip: string) {
    return this.http.get<ViaCep>(`http://viacep.com.br/ws/${zip}/json/`);
  }
}
