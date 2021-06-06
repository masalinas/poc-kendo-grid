import { Component, ViewChild, ElementRef, HostListener, OnInit } from '@angular/core';
import { Observable, Subscription, timer, pipe,  } from "rxjs";
import { map, share } from 'rxjs/operators';

import { GridComponent, GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { process, State, SortDescriptor } from "@progress/kendo-data-query";

import { categories } from "../assets/data/data.catergories";
import { products } from '../assets/data/data.products';
import { StatePersistingService } from './state-persisting.service';
import { GridSettings } from './grid-settings.interface';
import { ColumnSettings } from './column-settings.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [StatePersistingService],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class AppComponent implements OnInit {
  @ViewChild('gridProducts') gridProducts: ElementRef;
  public pageHeight = window.innerHeight - 80;
  public title: String = "poc-kendo-grid";
  
  public dropDownItems = categories;
  public defaultItem: any = { text: "Filter by Category", value: null };

  private subscription: Subscription;
  public clock: any;

  public pageSize: number = 10;
  public sampleProducts: any;

  public occurrenceReportToUpdate01: any = {"e2Id":"OR-0000000000027838","version":"0.0","type":"OR","status":"DRAFT","responsibleEntityId":29,"reportingEntityId":101345,"pdfCode":1,"relatedReports":[],"rowsTaxCodes":{"24":{"ATTRIBUTES":{"452":["00000000971.mew"],"453":[2165]},"ENTITIES":{"53":[{"ATTRIBUTES":{"802":[{"path":"f7943c67-96d7-4dcd-bd5d-a2364ded84ef","fileName":"image (8).png","description":"w"}],"1091":[3]},"ID":"ID00000000000000000000000000000001"}]}},"taxonomy_version_id":1},"rowsLanguage":null,"updated":{"None":[]},"blocked":false,"creationUser":"DavilaTest","creationDate":"14/05/2021 13:03:54","lastModificationUser":"DavilaTest","lastModificationDate":"14/05/2021 13:05:46","sharedEntities":{"sharedEntitiesId":[],"sharedAttachmentsEntitiesId":[],"deidentifiedTaxonomyCodes":[]},"personalDetails":{"firstName":"Jose","lastName":"Dávila","username":null,"telephone":null,"email":"jadavila@gloin.es","hashE5Z":null,"organisation":null}};
  public occurrenceReportToUpdate02: any = {"e2Id":"VR-0000000000000427","version":"0.2","type":"VR","status":"OPEN","responsibleEntityId":29,"reportingEntityId":6143,"pdfCode":null,"relatedReports":["OR-0000000000004287"],"rowsTaxCodes":{"24":{"ATTRIBUTES":{"432":[98],"433":["2018-07-11"],"440":["Lisboa: LPPT (LIS)"],"446":["WHT, White"],"448":[97],"451":[98],"452":["00000000661.mew"],"453":[2143],"454":[{"additionalText":"aa|@#|@,.,.,á","content":[2,1]}],"455":[2],"456":[2],"457":["07:10:00"],"477":["1655-07-14"],"478":["06:10:00"],"601":["Birdstrike during landing (hit proppeler Eng.1)"],"640":[21],"793":[{"path":"OC-0000000000005262","fileName":"PT2018-07-150 WHT CS-DJB (TP1137) White Airways_Report 2322.xps"},{"path":"OC-0000000000005262","fileName":"PT2018-07-150 WHT CS-DJB (TP1137) White Airways_Report 2322.pdf"}],"795":[1],"822":["2019-01-21"],"1072":[{"content":[11]}],"1087":[{"text":"atv"}],"1088":[2]},"ENTITIES":{"1":[{"ATTRIBUTES":{"1":["38.774166666666700"],"2":["-9.134166666666670"],"4":[{"unit":"ft","content":"374.014620000000000"}],"5":[{"content":[159020]}],"7":[6],"10":[1]},"ID":"ID00000000000000000000000000001996","ENTITIES":{"31":[{"ID":"ID2855984C3E6949D6A571088DEFE2EB9B"}]}}],"4":[{"ATTRIBUTES":{"21":[{"additionalText":"600 version","content":[6395]}],"32":[17],"54":["TAP1137"],"90":[1],"120":["TP1137"],"166":[6],"175":[{"unit":"kg","content":"21500.100000000000000"}],"209":[2],"214":[5],"215":[{"content":[1940044]}],"232":[2],"244":["CS-DJB"],"254":["1215"],"281":[194],"313":[2],"319":[107],"327":[2016],"637":[1],"638":[2]},"LINKS":[{"REF":"ID8094D7865D5543918C8FD5166FB6AAF3","ID":"ID00000000000000000000000000001998"},{"REF":"ID712C548A58DE4A489AC844B4EB67E0BF","ID":"ID00000000000000000000000000001999"}],"ID":"ID539A54B12BC04C8BABE301849904E746","ENTITIES":{}}],"14":[{"ATTRIBUTES":{"390":[2050301],"391":[10700]},"ID":"ID8094D7865D5543918C8FD5166FB6AAF3"}],"22":[{"ATTRIBUTES":{"424":[46],"425":[{"text":"{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang1040{\\fonttbl{\\f0\\fnil\\fcharset0 NimbusSanL-Regu;}{\\f1\\fswiss\\fcharset0 Tahoma;}}\r\n{\\colortbl ;\\red51\\green51\\blue51;\\red0\\green0\\blue255;}\r\n\\viewkind4\\uc1\\pard\\cf1\\f0\\fs20 Voo TP 1137, M\\'e1laga - Lisboa. Logo depois de aterrar na pista 03 em Lisboa, Surgiu repentinamente um bando de pombos (estimado em cerca de vinte) do lado esquerdo do avi\\'e3o, voando a uma altitude que iria da pista at\\'e9 \\'e0 altura da asa e a uma dist\\'e2ncia da fuselagem inferior ao comprimento da asa.Passaram tr\\'eas pelo lado direito do avi\\'e3o e os restantes pelo lado esquerdo. N\\'e3o foi sentido, no cockpit, qualquer sinal de impacto.Inform\\'e1mos o ATC do ocorrido dando a entender que havia a possibilidade de ter havido algum impacto, atendendo \\'e0 dist\\'e2ncia a que estiveram da fuselagem e \\'e0 altura de voo. A controladora informou que ia enviar o falcoeiro e pouco tempo depois ouvi-a informar alguns avi\\'f5es que estavam a rolar, e outros a pedir \"push back\", para aguardarem instru\\'e7\\'f5es, porque na inspec\\'e7\\'e3o feita \\'e0 pista foram encontradas algumas aves mortas e estavam a remov\\'ea-las. Depois do avi\\'e3o parado, eu e mais um mec\\'e2nico da AEROMEC, fizemos uma inspe\\'e7\\'e3o ao avi\\'e3o em que se detetaram marcas de sangue no bordo de ataque de uma das p\\'e1s do h\\'e9lice esquerdo. O avi\\'e3o ficou a operar normalmente. \\cf2\\b\\f1 (Operator Report)\\par\r\n\\cf0\\b0\\fs18\\par\r\n}\r\n"}]},"ID":"ID00000000000000000000000000001995"}],"23":[{"ATTRIBUTES":{"426":[{"text":"{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang1040{\\fonttbl{\\f0\\fswiss\\fprq2\\fcharset0 Tahoma;}{\\f1\\fswiss\\fprq2\\fcharset0 Calibri;}{\\f2\\fswiss\\fcharset0 Tahoma;}}\r\n\\viewkind4\\uc1\\pard\\lang1033\\f0\\fs18 Bird Remains: Collected\\par\r\nBird(s) Ingested?: N/A\\par\r\n\\pard\\sa160\\sl252\\slmult1\\lang2070 Effect on Flight: None\\f1\\fs22\\par\r\n\\pard\\lang1040\\f2\\fs18\\par\r\n}\r\n"}],"608":["BIRD"]},"ID":"ID00000000000000000000000000001997"}],"53":[{"ATTRIBUTES":{"447":[{"content":[6143]}],"476":[2],"495":[{"content":[9808]}],"800":[2],"801":["2018-07-12"],"802":[{"path":"OC-0000000000005262","fileName":"PT2018-07-150 WHT CS-DJB (TP1137) White Airways_Report 2322.xps"},{"path":"OC-0000000000005262","fileName":"PT2018-07-150 WHT CS-DJB (TP1137) White Airways_Report 2322.pdf"}],"1064":[{"content":[8]},{"content":[12]}],"1091":[46],"1092":[{"text":"Voo TP 1137, Málaga – Lisboa. Logo depois de aterrar na pista 03 em Lisboa, Surgiu repentinamente um bando de pombos (estimado em cerca de vinte) do lado esquerdo do avião, voando a uma altitude que iria da pista até à altura da asa e a uma distância da fuselagem inferior ao comprimento da asa. Passaram três pelo lado direito do avião e os restantes pelo lado esquerdo. Não foi sentido, no cockpit, qualquer sinal de impacto. Informámos o ATC do ocorrido dando a entender que havia a possibilidade de ter havido algum impacto, atendendo à distância a que estiveram da fuselagem e à altura de voo. A controladora informou que ia enviar o falcoeiro e pouco tempo depois ouvi-a informar alguns aviões que estavam a rolar, e outros a pedir \"push back\", para aguardarem instruções, porque na inspecção feita à pista foram encontradas algumas aves mortas e estavam a removê-las. Depois do avião parado, eu e mais um mecânico da AEROMEC, fizemos uma inspeção ao avião em que se detetaram marcas de sangue no bordo de ataque de uma das pás do hélice esquerdo. O avião ficou a operar normalmente."}]},"ID":"ID00000000000000000000000000001993"}],"59":[{"ATTRIBUTES":{"718":[1]},"ID":"ID0000000000000000000000000000199B"}]}},"taxonomy_version_id":1},"rowsLanguage":null,"updated":{"None":[]},"blocked":false,"creationUser":"AllC","creationDate":"29/04/2021 13:59:48","lastModificationUser":"system","lastModificationDate":"29/04/2021 13:59:48","sharedEntities":{"sharedEntitiesId":[],"sharedAttachmentsEntitiesId":[],"deidentifiedTaxonomyCodes":[]},"personalDetails":{"firstName":"test","lastName":"test","username":null,"telephone":null,"email":"cristina.gegundez@twtspain.com","hashE5Z":null,"organisation":{"name":"OrgSpainCristi","organisation_id":32}}};

  getAttributeFromTaxonomy(node: any, item: String) {
    let result: any = null;

    // check attributes
    if (node.ATTRIBUTES) {
      for (let key of Object.keys(node.ATTRIBUTES)) {
        if (key === item)
          return node.ATTRIBUTES[key][0];
      };
    }
    
    // recursive check attributes
    if (node.ENTITIES) {
      for (let key of Object.keys(node.ENTITIES)) {
        result = this.getAttributeFromTaxonomy(node.ENTITIES[key][0], item);

        if (result)
          return result;
      }
    }
    else
      return null;
  }

  @HostListener("window:resize", ['$event'])
  onResize(event: any) {
    this.pageHeight = event.target.innerHeight - 80;
  }

  public gridSettings: GridSettings = {
    state: {
      skip: 0,
      take: 10,

      // Initial filter descriptor
      filter: {
        logic: 'and',
        filters: []
      }
    },
    gridData: process(products, {
      skip: 0,
      take: 5,
      // Initial filter descriptor
      filter: {
        logic: 'and',
        filters: []
      }
    }),
    columnsConfig: [{
      field: 'ProductID',
      title: 'ID',
      filterable: false,
      _width: 60
    }, {
      field: 'ProductName',
      title: 'Product Name',
      filterable: true,
      _width: 300
    }, {
      field: 'FirstOrderedOn',
      title: 'First Ordered On',
      filter: 'date',
      format: '{0:d}',
      _width: 240,
      filterable: true
    }, {
      field: 'UnitPrice',
      title: 'Unit Price',
      filter: 'numeric',
      format: '{0:c}',
      _width: 180,
      filterable: true
    }, {
      field: 'Discontinued',
      filter: 'boolean',
      _width: 120,
      filterable: true
    }]
  };

  public get savedStateExists(): boolean {
    return !!this.persistingService.get('gridSettings');
  }

  constructor(public persistingService: StatePersistingService) {
    // test ocurrences
    this.findTaxonomyByAttribute("120");

    // load grid from state saved
    this.loadGridItems();
  }

  ngOnInit() {
    this.createTimer();
  }

  private findTaxonomyByAttribute(attribute: String) {
    let result: any = this.getAttributeFromTaxonomy(this.occurrenceReportToUpdate02.rowsTaxCodes["24"], attribute);

    console.log(result);
  }

  private createTimer() {
    this.subscription = timer(0, 1000)
    .pipe(
      map(() => new Date()),
      share()
    )
    .subscribe(time => {
      this.clock = time;
    });
  }
  
  private loadGridItems(): void {
    const gridSettings: GridSettings = this.persistingService.get('gridSettings');

    if (gridSettings !== null) {
      this.gridSettings = this.mapGridSettings(gridSettings);
    }
  }
  
  public handleFilterChange(event: any): void {
    if (event.value != null) {
      let filter: any = this.gridSettings.state.filter.filters.find(
        (filter: any) => filter.field === 'Category.CategoryName');

      if (filter) {
        filter.value = event.text;

        let columnsConfig: any = this.gridSettings.columnsConfig.find(
          (filter: any) => filter.field === 'Category.CategoryName');

        columnsConfig.value = event.text;
      }
      else {
        this.gridSettings.state.filter.filters.push({
          field: "Category.CategoryName",
          operator:"contains",
          value: event.text});

        let columnsConfig: any = this.gridSettings.columnsConfig.find(
          (filter: any) => filter.field === 'Category.CategoryName');

        columnsConfig.value = event.text;
      }
    } else {
      const filteredCategory: number = this.gridSettings.state.filter.filters.findIndex((filter: any) => filter.field == "Category.CategoryName");

      if (filteredCategory != -1)
        this.gridSettings.state.filter.filters.splice(filteredCategory, 1);
    }

    this.dataStateChange(this.gridSettings.state);
    this.mapGridSettings(this.gridSettings);
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.gridSettings.gridData = process(products, state);
}

  public saveGridSettings(grid: GridComponent): void {
  const columns = grid.columns;

  const gridConfig = {
    state: this.gridSettings.state,
    columnsConfig: columns.toArray().map((item: any) => {
      return Object.keys(item)
        .filter(propName => !propName.toLowerCase()
          .includes('template'))
          .reduce((acc, curr) => ({...acc, ...{[curr]: item[curr]}}), <ColumnSettings> {});
    })
  };

  this.persistingService.set('gridSettings', gridConfig);
  }

  public mapGridSettings(gridSettings: GridSettings): GridSettings {
  const state = gridSettings.state;
  this.mapDateFilter(state.filter);

  return {
    state,
    columnsConfig: gridSettings.columnsConfig.sort((a, b) => a.orderIndex - b.orderIndex),
    gridData: process(products, state)
  };
  }

  private mapDateFilter = (descriptor: any) => {
  const filters = descriptor.filters || [];

  filters.forEach((filter: any) => {
      if (filter.filters) {
          this.mapDateFilter(filter);
      } else if (filter.field === 'FirstOrderedOn' && filter.value) {
          filter.value = new Date(filter.value);
      }
  });
  }

  ngOnDestroy() {    
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
