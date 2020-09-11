import { Component, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { GlobalParamsService } from '../global-params.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  
  selectedTab;
  
  constructor(public props: GlobalParamsService) {}
  
  @ViewChild('tabs', { static: false }) tabs: IonTabs;
  
  setCurrentTab() {
    this.selectedTab = this.tabs.getSelected();
    console.log(this.selectedTab);
    this.props.currentTab = this.selectedTab;
  }

}