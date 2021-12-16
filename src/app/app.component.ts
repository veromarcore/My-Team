import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NgxCsvParser } from 'ngx-csv-parser';
import { faUpload, faStar, faList, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { NgxCSVParserError } from 'ngx-csv-parser';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent {
	//Icons
	faUpload=faUpload;
	faStar=faStar;
	faList=faList;
	faTimesCircle=faTimesCircle;
	//csv data
	csvRecords: any[] = [];
	csvHeader: any[] = [];
	header: boolean = false;
	alerta: boolean = false;
	csvDesc: any = {};

	//step indication
	step: string = 'ONE';
	
	
	constructor(private ngxCsvParser: NgxCsvParser) {
	}
	
	@ViewChild('fileImportInput') fileImportInput: any;
	
	fileChangeListener($event: any): void {
		
		const files = $event.srcElement.files;
		this.header = (this.header as unknown as string) === 'true' || this.header === true;
		
		this.alerta=false;
		this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ',' })
		.pipe().subscribe((result: any) => {
			//remove fist row to use it as a header
			this.csvHeader = result[0];
			result.splice(0,1);
			
			//initial position count
			this.csvDesc.goalkeeper=0;
			this.csvDesc.defender=0;
			this.csvDesc.midfielder=0;
			this.csvDesc.forward=0;
			result.forEach((childObj: any[])=> {
				for(var i = 0; i <= 5; i++){
					//Empty Data validation
					if(childObj[i]== null || childObj[i]== "0"
					|| childObj[i]== "Unknown" || childObj[i]== ""){
						this.alerta=true;
					}
					else{
						childObj.push(false);
					}
				};
				//Position count
				if (childObj[2] == 'Goalkeeper') {
					this.csvDesc.goalkeeper=this.csvDesc.goalkeeper+1;
				} else if (childObj[2] == 'Defender'){
					this.csvDesc.defender=this.csvDesc.defender+1;
				} else if (childObj[2] == 'Midfielder'){
					this.csvDesc.midfielder=this.csvDesc.midfielder+1;
				} else if (childObj[2] == 'Forward'){
					this.csvDesc.forward=this.csvDesc.forward+1;
				}
			});
			if (!this.alerta){ //when no error set result
				this.csvRecords = result;
			}
			
		}, (error: NgxCSVParserError) => {
			this.alerta=true;
			console.log('Error', error);
		});
	}
	
	//set file name
	onFileSelected() {
		this.csvDesc.filename=this.csvDesc.file.split(/(\\|\/)/g).pop();
	}
	
	//change screen 
	NextStep() {  
		if (this.step=='ONE') {
			this.step='TWO';
		}
		else if (this.step=='TWO') {
			this.step='THREE';
		} 
		else if (this.step=='THREE'){
			this.step='FOUR';
		}  
	}
	
	PreviousStep() {  
		if (this.step=='FOUR') {
			this.step='THREE';
		}
		else if (this.step=='THREE') {
			this.step='TWO';
		} else {
			this.step='ONE';
		}    
	}
	
	ImportFile() {  
		this.step='ONE';
		this.csvDesc={};  
	}
	
	
}
