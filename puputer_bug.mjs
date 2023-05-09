import puppeteer from 'puppeteer';
import * as fs from 'fs';
import xlsx from 'node-xlsx';
import { BROWSER_CONFIG, sheetOptions, FILE_NAME } from './config.mjs'
import { getInfo } from './utils.mjs'

(async () => {
  const browser = await puppeteer.launch(BROWSER_CONFIG);
  try {
    const data = await getInfo(browser)
    const buffer = xlsx.build(data, { sheetOptions });
    fs.writeFileSync(`./${FILE_NAME}.xlsx`, buffer, "binary");
    console.info('加载成功，快去查看吧～～～')
  } catch (error) {
    console.info('加载失败，原因母鸡啊')
    console.warn(error)
  } finally {
    browser.close()
  }
})()