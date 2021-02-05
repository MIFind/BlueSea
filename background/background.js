// chrome.runtime.onInstalled.addListener(async () => {
//   console.log('欢迎使用');
// });

chrome.runtime.onMessage.addListener(
  ({ type, payload }, sender, sendResponse) => {
    if (type === 'tf') {
      (async () => {
        const materialList = await bluesea.getMaterials();
        const material = materialList.find((it) => it.text === payload);
        if (material && material.youdao) {
          sendResponse(material.youdao);
        } else {
          const res = await fetch(
            `https://service-pnrys8g3-1254074572.bj.apigw.tencentcs.com/release?text=${payload}&appkey=663c48246fefa63c&key=WojrRGSsP8O2Vd253EZqxNCpisQ6mkVZ`
          ).then((raw) => raw.json());
          if (res.success) {
			  console.log(res)
            sendResponse(res.content);
          } else {
            sendResponse();
          }
        }
      })();
    }

    if (type === 'calcEls') {
      const forLowerCase = (text) => {
        return text.toLowerCase();
      };
      const result = payload[0].reduce((pre, cur, index) => {
        const hasExist = payload[1].some((it) => {
          return forLowerCase(cur).includes(forLowerCase(it.text));
        });
        return hasExist ? [...pre, index] : pre;
      }, []);
      sendResponse(result);
    }

    return true;
  }
);
