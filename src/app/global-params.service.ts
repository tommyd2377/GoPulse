import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class GlobalParamsService {

  title: string;
  articleUrl: string;
  publisher: string;
  publishDate: string;
  titleID: string;
  
  currentTab: string = "home";

  userId: string;

}