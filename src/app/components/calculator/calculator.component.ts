import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {

  public title: string = 'Calculator'
  operations = [ '/', '*', '-', '+','=' ]
  digits = [7,8,9,4,5,6,1,2,3,'+/-',0, '.']
  symbols = ['C', 'AC']
  val = ''
  evaluate = ''
  expression = ''
  expressionsHistory: string[] = []

  id:any;
  btnValue:any;
  lastValuesArray: any = [];
  previousValueInArray: any = '';

  showHistoryContainer: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.expressionsHistory = this.getDataFromLocalStorage();
  }

  addToLocaleStorage(): void {
    localStorage.setItem('history', JSON.stringify(this.expressionsHistory));
  }

  getDataFromLocalStorage(): string[] {
    return JSON.parse(localStorage.getItem('history') || '[]');
  }

  pushExpressionToHistory(): void {
    this.expressionsHistory.push(`${this.expression}=${this.val}`);
  }

  selectFromHistory(event:any): void{
    this.val = event.srcElement.innerText.split("=")[0];
    this.evaluate = eval(this.val);

    // this.evaluate = parseFloat(eval(this.val)).toFixed(2);
  }

  evaluateExpression(): void {
    this.expression = this.val;
    this.val = eval(this.val); 
  }

  deleteLastDigit(): void {
    if (this.val != '') {
      this.val = this.val.slice(0, this.val.length - 1);
      this.evaluate = this.val; 
    }
  }

  clearValues(): void {
    this.val = '';
    this.evaluate = '';
  }

  reverseValue(): void {
    this.val = this.evaluate;
    this.val = `${-1 * parseInt(this.val)}`;
    this.evaluate = this.val;
  }
  
  checkAndEvaluate(): void {
    this.previousValueInArray = this.lastValuesArray[this.lastValuesArray.length - 1];
    this.lastValuesArray.push(this.btnValue);

    // Prevents user to enter unallowed values or operations as first values
    if (
      this.btnValue == '0' || 
      this.btnValue === '.' ||
      this.btnValue === '/' ||
      this.btnValue === '*' ||
      this.btnValue === '-' ||
      this.btnValue === '+' ||
      this.btnValue === '.'
      ) {
      if (this.val === '') return;
    }

    // Prevents user to select operations twice
    if (
      this.btnValue === '/' ||
      this.btnValue === '*' ||
      this.btnValue === '-' || 
      this.btnValue === '+' ||
      this.btnValue === '.'
    ) {
      if(this.lastValuesArray.length > 1)  {
        if (
          this.previousValueInArray === '/' ||
          this.previousValueInArray === '*' ||
          this.previousValueInArray === '-' ||
          this.previousValueInArray === '+' ||
          this.previousValueInArray === '.'
        ) return;
        
        this.val += this.btnValue;
      } return;
    } 
    this.val += this.btnValue;
    this.evaluate = eval(this.val);
  }

  onBtnClick(id: any): void {
  
    this.btnValue = id;
    
    if(this.btnValue === "=") {
      if (this.val === '' || this.val == this.evaluate) return; 
      this.evaluateExpression();
      this.pushExpressionToHistory();
      this.addToLocaleStorage();
      this.val = '';
    } 
    else if (this.btnValue === 'C') {
      this.clearValues();
    } 
    else if (this.btnValue === '+/-') {
      this.reverseValue();
    } 
    else if (this.btnValue === 'AC') {
      this.deleteLastDigit();
    }
    else {
      this.checkAndEvaluate();
    }
  }
  
  toggleHistory(event:any): void {
    this.showHistoryContainer = !this.showHistoryContainer;
  }

  clearHistory(event:any): void {
    localStorage.clear();
    this.expressionsHistory = this.getDataFromLocalStorage();
  }
}

