import axios from 'axios'
import { IEVersion } from '@/utils/publicMethods.ts'
interface PARAM {
  [key: string]: any
}
/**
 * 一、request：
 *  1. 说明：封装对后台的请求，可以选择自动处理一些异常。
 *  2. 参数：
 *     - url：            后台地址，必填，String，如："/user/add"
 *     - params：         请求参数，必填，Object，如：{"name":"xxx"}
 *     - config：         axios参数，选填，Object，默认值：{}
 *     - autoErrorRes： 是否自动处理响应错误，选填，Boolean，默认值：true
 *     - autoErrorData：是否自动处理后台错误，选填，Boolean，默认值：true
 *  3. 返回：
 *     - 成功：Promise.resolve(请求成功后的结果：response.data.data)
 *     - 失败：
 *     - 请求异常：Promise.reject(http响应错误)
 *     - 请求失败：Promise.reject(请求失败后的结果：response.data.message)
 *  4. 约定后台返回数据格式：
 *     response.data = {
 *       "code": 200,              //200代表成功响应，401代表token失效...
 *       "data": {},                  //请求成功后的结果
 *        "msg": "用户名字重复"     //请求失败描述
 *       }
 *     }
 *
 * 另外为了加快访问速度，有时我们需要对请求进行缓存。
 * 二、sessionRequest：
 *  1. 说明：利用sessionStorage缓存请求，可以选择outTime，其他同request。
 *  2. 参数：
 *      - outTime：距离上次请求多少秒后需要重新请求，选填，Integer，小于0表示不重新请求，默认值：-1
 * 三、localRequest：
 *  1. 说明：利用localStorage缓存请求，可以选择outTime，其他同request。
 *  2. 参数：
 *      - outTime：距离上次请求多少秒后需要重新请求，选填，Integer，小于0表示不重新请求，默认值：604800（一周）
 *
 */

// 为每个请求设置默认baseURL，并添加token
axios.defaults.baseURL = ''
axios.interceptors.request.use(function (config: any) {
  // if (config.token !== false) {
  config.headers.Authorization = sessionStorage.getItem('user-token')
  config.headers.common['Cache-Control'] = 'no-cache'
  config.headers.common['Pragma'] = 'no-cache'
  if (config.method === 'post') {
    const ieVerson = IEVersion()
    if ([6, 7, 8, 9, 10, 11].indexOf(ieVerson) > -1) {
      // config.url = `${config.url}?t=${Date.parse(new Date())}`
      config.data = {
        ...config.data,
        t: new Date().getTime()
      }
    }
  }
  // }
  if (config.Authorization) {
    config.headers.Authorization = config.Authorization
  }
  return config
})
// @ts-ignore
export const request = (url: string, params?: any, config?: any, autoErrorRes = true, autoErrorData = true) => {
  // let sysPrefix = window.location.pathname.match(/(^\/[^\/]\S*[^\/])(\/)$/)
  // if (sysPrefix === null) {
  //   sysPrefix = ''
  // } else {
  //   sysPrefix = sysPrefix[1]
  // }
  // ie缓存问题
  // if (params) {
  //   params['ierandom'] = encodeURIComponent(Math.random())
  // }

  const args = {
    'method': 'get',
    'url': `${url}`,
    'data': params,
    ...config
  }

  // 上传文件的接口请求如果需要额外参数或者不需要token，可以在config里配置，这里根据情况过滤处理一次args
  if (args.method === 'post') {
    return axios(args).then(successFunc(autoErrorRes, autoErrorData), failFunc(autoErrorRes, autoErrorData))
  }

  if (args.method === 'get') {
    return axios({
      method: 'get',
      url: args.url,
      params: args.data,
      ...config
    }).then(successFunc(autoErrorRes, autoErrorData), failFunc(autoErrorRes, autoErrorData))
  }

  if (args.method === 'delete') {
    return axios({
      method: 'delete',
      url: args.url,
      params: args.data,
      ...config
    }).then(successFunc(autoErrorRes, autoErrorData), failFunc(autoErrorRes, autoErrorData))
  }
}

const successFunc = (autoErrorRes: any, autoErrorData: any) => {
  return (res: any) => {
    // 接口异常处理
    // if (res.data.code != 200) {
    //   // token失效
    //   if (res.data.code === 401) {
    //     return
    //   }
    //   if (res.data.code === -1) {
    //   } else if (autoErrorData) {
    //     // 其他业务错误
    //   }
    //   return Promise.resolve(res.data)
    // }
    // 接口正常响应
    return Promise.resolve(res.data)
  }
}

const failFunc = (autoErrorRes:any, autoErrorData:any) => {
  return (error: any) => {
    // 后台异常处理
    // console.error(error)
    // if (autoErrorRes) {
    //
    // }
    return Promise.reject(error)
  }
}

request.get = (url: string, params = null, config = {}, autoErrorRes = true, autoErrorData = true) => {
  const conf = {
    ...config,
    method: 'get'
  }
  return request(url, params, conf, autoErrorRes, autoErrorData)
}

request.post = (url: string, params = null, config = {}, autoErrorRes = true, autoErrorData = true) => {
  const conf = {
    ...config,
    method: 'post'
  }
  return request(url, params, conf, autoErrorRes, autoErrorData)
}
request.delete = (url: string, params = null, config = {}, autoErrorRes = true, autoErrorData = true) => {
  const conf = {
    ...config,
    method: 'delete'
  }
  return request(url, params, conf, autoErrorRes, autoErrorData)
}

/* 使用sessionStorage缓存的请求 */
export const sessionRequest = (StorageObj: any,url: string, params: PARAM, outTime = -1, config = {}, autoErrorRes = true, autoErrorData = true) => {
  const item_key = url + '#' + JSON.stringify(params)
  let itemVal = StorageObj.getItem(item_key)
  const nowTime = new Date().getTime()
  if (itemVal) {
    itemVal = JSON.parse(itemVal)
    const over_time = nowTime - itemVal.last_time
    if (outTime < 0 || over_time < outTime * 1000) {
      return Promise.resolve(itemVal.data)
    }
  }
  // @ts-ignore
  return request(url, params, config, autoErrorRes, autoErrorData).then(data => {
    sessionStorage.setItem(item_key, JSON.stringify({
      'last_time': nowTime,
      'data': data
    }))
    return data
  })
}

/* 使用localStorage缓存的请求 */
// export const localRequest = (url, params, outTime = 604800, config = {}, autoErrorRes = true, autoErrorData = true) => {
//   const item_key = url + '#' + json.stringify(params)
//   let itemVal = localStorage.getItem(item_key)
//   const nowTime = new Date().getTime()
//   if (itemVal) {
//     itemVal = json.parse(itemVal)
//     const over_time = nowTime - itemVal.last_time
//     if (outTime < 0 || over_time < outTime * 1000) {
//       return Promise.resolve(itemVal.data)
//     }
//   }
//   return request(url, params, config, autoErrorRes, autoErrorData).then(data => {
//     localStorage.setItem(item_key, json.stringify({
//       'last_time': nowTime,
//       'data': data
//     }))
//     return data
//   })
// }
