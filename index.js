const got = require('got')
const cheerio = require('cheerio')

const cnodeUrl = 'https://www.nowcoder.com/discuss';
const init  = async ()=>{
  const request =  await got(cnodeUrl)
    const $ = cheerio.load(request.body);
    const ele = $('.common-list li .discuss-detail .discuss-content a.discuss-content-text')
    ele.each((idx, element)=>{
      console.log( $(element).text() + '  '+ 'https://www.nowcoder.com' +$(element).attr('href') +'\n')
    });
}
init()
