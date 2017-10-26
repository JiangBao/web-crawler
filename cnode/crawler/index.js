const Crawler = require('crawler');

const c = new Crawler({
  maxConnections: 10,
  callback: (err, res, done) => {
    if (err) {
      console.error(err);
    } else {
      const infos = getDataFromResp(res.$);
      // deal data
      console.log(infos);
    }
    done();
  }
});

function start () {
  var queue = [];
  for (let i = 1; i < 3; i++) {
    queue.push(`https://cnodejs.org?page=${i}`);
  }
  c.queue(queue);
}

function getDataFromResp ($) {
  var infos = [];
  $('#topic_list .cell').each((idx, elem) => {
    const $topic_title = $(elem).find('.topic_title');
    const $user = $(elem).find('.user_avatar').find('img');

    const title = $topic_title.attr('title');
    const href = $topic_title.attr('href');
    const author = $user.attr('title');
    const avatar = $user.attr('src');

    infos.push({
      title:  title,
      href:   'https://cnodejs.org' + href,
      author: author,
      avatar: avatar
    });
  });

  return infos;
}

start();