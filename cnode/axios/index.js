const axios = require('axios');
const cheerio = require('cheerio');
const dao = require('../public/dao.js');

/**
 * main class
 */
class Crawler {
  constructor() {
    this.page = 1;
    this.href = [];
    this.hrefs = [];
    this.url = 'https://cnodejs.org';
    this.start = this.start.bind(this);
  }

  async start() {
    if (this.page > 3) {
      this.hrefs = await dao.findHref();
      return this.getContent();
    }
    
    console.log(`get page ${this.page}...`);
    const resp = await axios.get(`${this.url}?page=${this.page}`);
    const $ = cheerio.load(resp.data);
    const infos = this.getDataFromResp($);
    await dao.insertMany(infos);
    setTimeout(this.start, 2000);
    this.page++;
  }

  async getContent() {
    Promise.all(this.reqControl())
      .then((val) => {
        console.log('crawler content...');
        for (let i = 0, len = val.length; i < len; i++) {
          const $ = cheerio.load(val[i].data);
          const content = $('.markdown-text').html();
          dao.updateContent(this.href[i]._id, content).then();
        }
        this.hrefs.length ? this.getContent() : process.exit();
      })
      .catch((err) => {
        console.error(err.stack);
      })
  }

  reqControl() {
    var arr = [];
    this.href = this.hrefs.splice(0, 10);
    for (let i = 0, len = this.href.length; i < len; i++) {
      arr.push((() => {
        return axios.get(this.href[i].href);
      })());
    }

    return arr;
  }

  getDataFromResp($) {
    var infos = [];
    $('#topic_list .cell').each((idx, elem) => {
      const $topic_title = $(elem).find('.topic_title');
      const $user = $(elem).find('.user_avatar').find('img');

      const title = $topic_title.attr('title');
      const href = $topic_title.attr('href');
      const author = $user.attr('title');
      const avatar = $user.attr('src');

      infos.push({
        title: title,
        href: this.url + href,
        author: author,
        avatar: avatar
      });
    });

    return infos;
  }
}

new Crawler().start();
