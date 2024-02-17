import { Component, Injectable, VERSION, ViewChild, Inject, ElementRef, Input, Directive, OnChanges } from "@angular/core";
import { Router } from '@angular/router';
import { VentasComponent } from './ventas.component';
import { create, SheetsRegistry } from "jss";
import preset from "jss-preset-default";

const jss = create(preset());
const styles = {
  singleLine: `
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
    white-space: pre-wrap;
  `,
  printAreaContainer: `
    padding: 8px;
  `,
  fontMono: {
    fontFamily: "monospace"
  },
  textCenter: {
    textAlign: "center"
  },
  textRight: {
    textAlign: "right"
  },
  textLeft: {
    textAlign: "left"
  },
  fontBold: {
    fontWeight: "bold"
  },
  grid3Col: {
    display: "grid",
    columnGap: "5px",
    gridTemplateColumns: "1fr auto auto"
  },
  gridBorderSolid: `
    border-bottom: 1px solid;
  `,
  gridBorderDashed: `
    border-bottom: 1px dashed;
  `,
  gridBorderDouble: `
    border-bottom: 3px double;
  `,
  gridBorder: `
    grid-column: 1 / -1;
    margin: 4px 0;
  `,
  nowrap: {
    overflow: "hidden",
    textOverflow: "clip",
    whiteSpace: "nowrap"
  },
  colSpan2: {
    gridColumn: "span 2 / span 2"
  },
  maxLine2: {
    maxHeight: "30px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical"
  },
  maxLine: {
    maxHeight: "30px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 4,
    "-webkit-box-orient": "vertical"
  }
};

const sheets = new SheetsRegistry();
const sheet = jss.createStyleSheet(styles);
sheets.add(sheet);
const { classes } = sheet.attach();

@Injectable({
  providedIn: 'root'
})
export class InvoiceComponent {

  constructor(public data: VentasComponent) {
    //dialogo.disableClose = false
  }

  //@ViewChild('html', { static: false }) elementRef;
  @Input()
  width!: "80mm";
  classes = classes;

  public testPrint(): void {
    //console.log(this.elementRef.nativeElement.innerHTML)
    const tpm = new ThermalPrinterService(this.width);
    const styles = sheets.toString();
    tpm.setStyles(styles);
    //tpm.addRawHtml(this.elementRef.nativeElement.innerHTML);
    tpm.print();
    //this.dialogo.close(true);
  }
}

class ThermalPrinterService {
  printContent = ``;
  cssStyles = ``;

  constructor(private paperWidth: "80mm" | "58mm") { }

  addRawHtml(htmlEl: any) {
    this.printContent += `\n${htmlEl}`;
  }

  addLine(text: any) {
    this.addRawHtml(`<p>${text}</p>`);
  }

  addLineWithClassName(className: any, text: any) {
    this.addRawHtml(`<p class="${className}">${text}</p>`);
  }

  addEmptyLine() {
    this.addLine(`&nbsp;`);
  }

  addLineCenter(text: any) {
    this.addLineWithClassName("text-center", text);
  }

  setStyles(cssStyles: any) {
    this.cssStyles = cssStyles;
  }

  print() {
    const printerWindow = window.open(``, `_blank`);
    printerWindow?.document.write(`
      <!DOCTYPE html>
      <html>
      
      <head>
        <title>Print</title>
        <style>
          html { padding: 0; margin: 0; width: ${this.paperWidth}; }
          body { margin: 0; }
          ${this.cssStyles}
        </style>
        <script>
          window.onafterprint = event => {
            window.close();
          };
        </script>
      </head>
  
      <body>
        ${this.printContent}
      </body>
      
      </html>
      
      `);

    printerWindow?.document.close();
    printerWindow?.focus();
    printerWindow?.print();
    window.close();
  }
}

/**
class ThermalPrinterManager {
  styles = StyleSheet.create({
    red: {
      backgroundColor: "red"
    },

    blue: {
      backgroundColor: "blue"
    },

    hover: {
      ":hover": {
        backgroundColor: "red"
      }
    },

    small: {
      "@media (max-width: 600px)": {
        backgroundColor: "red"
      }
    }
  });

  printContent = ``;

  addRawHtml(htmlEl:any) {
    this.printContent += `\n${htmlEl}`;
  }

  addLine(text:any) {
    this.addRawHtml(`<p>${text}</p>`);
  }

  addLineWithClassName(className: any, text:any) {
    this.addRawHtml(`<p class="${className}">${text}</p>`);
  }

  addEmptyLine() {
    this.addLine(`&nbsp;`);
  }

  addLineCenter(text: any) {
    this.addLineWithClassName("text-center", text);
  }

  print(): void {
    const tpm = new ThermalPrinterService(this.width);
    const styles = sheets.toString();
    console.log(this.elementRef.nativeElement.innerHTML);
    console.log(styles);
    tpm.setStyles(styles);
    tpm.addRawHtml(this.elementRef.nativeElement.innerHTML);
    tpm.print();
  }
}

print() {
  const printerWindow = window.open(``, `_blank`);
  printerWindow?.document.write(`
  <!DOCTYPE html>
  <html>
  
  <head>
    <title>Print</title>
    <style>

      html {
        padding: 0;
        margin: 0;
        font-family: monospace;
        width: 80mm;
      }

      body {
        margin: 0;
        padding: 8px;
      }

      p {
        margin-top: 0.25rem;
        margin-bottom: 0.25rem;
        white-space: pre-wrap;
      }

      .text-center {
        text-align: center;
      }

      .text-right {
        text-align: right;
      }

      .text-left {
        text-align: left;
      }

      .font-bold {
        font-weight: bold;
      }

      table {
        width: 100%;
      }

      tr, th, td {
        padding: 0;
      }

      .grid-line {
        overflow: hidden;
        text-overflow: clip;
        white-space: nowrap;
        grid-column: span 3 / span 3;
      }

      .nowrap {
        overflow: hidden;
        text-overflow: clip;
        white-space: nowrap;
      }

      .col-span-2 {
        grid-column: span 2 / span 2;
      }

      .max-line-2 {
        max-height: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

    </style>
    <script>
      window.onafterprint = event => {
        window.close();
      };
    </script>
  </head>

  <body>
    ${this.printContent}
  </body>
  

  </html>
  
  `);

  printerWindow?.document.close();
  printerWindow?.focus();
  printerWindow?.print();
}
*/
