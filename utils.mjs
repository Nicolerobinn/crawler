import * as cheerio from 'cheerio';
import { UA } from './config.mjs'
import { HOUSE_INFO, TITLE } from './config.mjs'
export const findTrim = (ele, select) => ele.find(select).text().replace(/\s*/g, "")

export const dataBuild = (content) => {
  const img = content.children('.info.clear').children('.title').children('a')
  const link = img.attr('href')
  const title = img.text()
  const positionInfo = findTrim(content, '.positionInfo')
  const houseInfo = findTrim(content, '.houseInfo')
  const followInfo = Number.parseInt(findTrim(content, '.followInfo').split('/')[0])
  const time = findTrim(content, '.followInfo').split('/')[1]
  const totalPrice = Number.parseFloat(findTrim(content, '.totalPrice2'))
  const unitPrice = Number.parseInt(findTrim(content, '.unitPrice').replace(/\,*/g, "")) / 10000
  return [
    title,
    link,
    positionInfo,
    houseInfo,
    followInfo,
    time,
    totalPrice,
    unitPrice
  ]
}
export async function newPageBug(browser, idx, { id }) {
  const page = await browser.newPage()
  await Promise.all([
    page.setUserAgent(UA),
    page.setJavaScriptEnabled(true),
    page.setViewport({ width: 800, height: 600 })
  ])
  // TODO: 动态获取城市地址
  const url = `https://wuhu.ke.com/ershoufang/${idx ? 'pg' + (idx + 1) : ''}${id}/`
  await page.goto(url)
  const html = await page.content()
  const $ = cheerio.load(html)
  let list = []
  $('.sellListContent li').each((_, element) => {
    const content = $(element)
    if (content.children('.img').attr('href')) {
      list.push(dataBuild(content))
    }
  });
  return list
}
export async function getInfo(browser) {
  return await Promise.all(HOUSE_INFO.map(async (item) => {
    // TODO: 动态爬取页面总数
    const data = (await Promise.all(new Array(9).fill(0).map((_, idx) => newPageBug(browser, idx, item)))).flat()
    return {
      name: item.name,
      data: [
        TITLE,
        ...data
      ]
    }
  }))
}