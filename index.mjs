import got from 'got'
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import { HOUSE_INFO, findTrim } from './config.js'

const init = async (idx, { name, id }) => {
  const request = await got(`https://wuhu.ke.com/ershoufang/${idx ? 'pg' + idx + 1 : ''}${id}/`)
  const $ = cheerio.load(request.body);
  const ele = $('.sellListContent li')
  ele.each((_, element) => {
    const content = $(element)
    if (content.children('.img').attr('href')) {
      const img = content.children('.info.clear').children('.title').children('a')
      const link = img.attr('href')
      const title = img.text()
      const positionInfo = findTrim(content, '.positionInfo')
      const houseInfo = findTrim(content, '.houseInfo')
      const followInfo = findTrim(content, '.followInfo')
      const totalPrice = findTrim(content, '.totalPrice2')
      const unitPrice = findTrim(content, '.unitPrice')
      const text = `${title}\n${link}\n${positionInfo}\n${houseInfo}\n${followInfo}\n${totalPrice}\n${unitPrice}\n\n====================\n\n`
      fs.appendFile(`./${name}.txt`, text, (err) => {
        console.log(err, '====>', name)
      });
    }
  });
}


HOUSE_INFO.forEach(async (item) => {
  fs.unlink(`./${item.name}.txt`, (err) => {
    console.log(err, '====>', item.name)
  });
  new Array(9).fill(0).forEach(async (_, idx) => {
    await init(idx, item)
  })
})

