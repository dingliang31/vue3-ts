import { number } from 'echarts'

/**
 * 判断浏览器版本
 * @returns number | string
 */
const IEVersion: any = () => {
  const userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
  const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 // 判断是否IE<11浏览器
  const isEdge = userAgent.indexOf('Edge') > -1 && !isIE // 判断是否IE的Edge浏览器
  const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
  if (isIE) {
    const reIE = new RegExp('MSIE (\\d+\\.\\d+);')
    reIE.test(userAgent)
    const fIEVersion = parseFloat(RegExp.$1)
    if (fIEVersion === 7) {
      return 7
    } else if (fIEVersion === 8) {
      return 8
    } else if (fIEVersion === 9) {
      return 9
    } else if (fIEVersion === 10) {
      return 10
    } else {
      return 6// IE版本<7
    }
  } else if (isEdge) {
    return 'edge'// edge
  } else if (isIE11) {
    return 11 // IE11
  } else {
    return -1// 不是ie浏览器
  }
}

/**
 * 截取浏览器第一个连续以/连接的字符串
 * @returns string
 */
const getPrefixPathname: any = () => {
  let sysPrefix: RegExpMatchArray | null | any = window.location.pathname.match(/(^\/[^\/]\S*[^\/])(\/)$/)
  if (sysPrefix === null) {
    sysPrefix = ''
  } else {
    sysPrefix = sysPrefix[1]
  }
  return sysPrefix
}

/**
 * 获取文件类型
 * @param {string} fileName
 * @returns string
 */
const getFileType: any = (fileName: string) => {
  switch (true) {
    case /(\.pdf)$/.test(fileName):
      return 'pdf'
    case /(\.xlsx|\.xls)$/.test(fileName):
      return 'excel'
    case /(\.docx|\.doc)$/.test(fileName):
      return 'word'
    case /(\.rar)$/.test(fileName):
      return 'rar'
    case /(\.zip)$/.test(fileName):
      return 'zip'
    case /(\.jpg|\.png|\.bmp|\.jpeg|\.BMP)/.test(fileName):
      return 'img'
  }
}

/**
 * 密码校验规则
 * @param {string} value
 * @returns string
 */
const validStrForPassword = (value: string) => {
  let r = ''
  // const reg = /^(?=.*\d)((?=.*[a-z])|(?=.*[!@#$%^&*])).{8,}$/ig
  const reg_Num = /(?=.*\d)/ig
  const reg_special = /((?=.*[a-z])|(?=.*[!@#$%^&*]))/ig
  // const reg_special = /(?=.*\d)((?=.*[a-z])|(?=.*[!@#$%^&*]))/ig

  if (value === '' || value === undefined) {
    r = '请输入登录密码'
  } else if (typeof value === 'string' && value.length < 8) {
    r = '密码应为不小于8位的字符串,由数字和字母或特殊字符组成'
  } else if (typeof value === 'string' && !reg_Num.test(value) && !reg_special.test(value)) {
    r = '密码应为不小于8位的字符串,由数字和字母或特殊字符组成'
  }
  return r
}

/**
 * 手机号校验
 * @param {string} value
 * @returns string
 */
const validStrForPhoneNum = (value: string | number) => {
  let r = ''
  const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
  if (value === '' || value === undefined) {
    r = '请输入手机号'
  } else if (typeof value === 'string' && !reg.test(value)) {
    r = '手机号格式错误'
  }
  return r
}

/**
 * 身份证号校验
 * @param {string} value
 * @returns string
 */
const validStrForIdentityNum = (value: string) => { //
  const reg18 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  const reg15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/
  let r = ''
  if (value === '' || value === undefined) {
    r = '请输入身份证件号码'
  } else if (!(reg15.test(value) || reg18.test(value))) {
    r = '身份证件号码格式错误'
  }
  return r
}
const validateIdCard = (idCard: string) => {
  // 15位和18位身份证号码的正则表达式
  const regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
   // 如果通过该验证，说明身份证格式正确，但准确性还需计算
  if ( regIdCard.test(idCard) ) {
    if ( idCard.length === 18 ) {
      const idCardWi: number[] = new Array( 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ) // 将前17位加权因子保存在数组里
      const idCardY: number[] = new Array( 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ) // 这是除以11后，可能产生的11位余数、验证码，也保存成数组
      let idCardWiSum: number = 0 // 用来保存前17位各自乖以加权因子后的总和
      for (let i = 0 ; i < 17 ; i++ ) {
        idCardWiSum += Number(idCard.substring(i, i + 1)) * idCardWi[i]
      }
      const idCardMod: number = idCardWiSum % 11; // 计算出校验码所在数组的位置
      const idCardLast: string = idCard.substring(17); // 得到最后一位身份证号码
      // 如果等于2，则说明校验码是10，身份证号码最后一位应该是X
      if ( idCardMod === 2 ) {
        if ( ['X', 'x'].includes(idCardLast) ) {
          return '恭喜通过验证啦！'
        } else {
          return '身份证号码错误！'
        }
      } else {
        // 用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
        if ( idCardLast === String(idCardY[idCardMod]) ) {
          return '恭喜通过验证啦！'
        } else {
          return '身份证号码错误！'
        }
      }
    }
  } else {
   return '身份证格式不正确!'
  }
}

/**
 * 手机号 & 身份证号脱敏展示
 * @param {string} str
 * @returns string
 */
const formatStrForSafe = (str: string) => {
  if (!str) {
    return ''
  }
  const reg = '/^(\d{4})\d*(\d{4}|\d{3}[0-9Xx])$/'
  const arr = str.match(reg)
  let l = 6
  let s = '******'
  if (arr) {
    l = str.length - 8
    if (l > 0) {
      s = ''
      for (let n = 0; n < l; n++) {
        s = s + '*'
      }
    }
    return `${arr[1]}${s}${arr[2]}`
  } else {
    return str
  }
}

/**
 * 校验统一社会信用代码
 * @param {string} Code
 * @returns string
 */
const validateSocialCreditCode = (Code: string) => {
  const patrn = /^[0-9A-Z]+$/
  // 18位校验及大写校验
  if ((Code.length !== 18) || !patrn.test(Code)) {
    return '不是有效的统一社会信用编码！'
  } else {
    let Ancode // 统一社会信用代码的每一个值
    let Ancodevalue //  统一社会信用代码每一个值的权重
    let total = 0
    const weightedfactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28] // 加权因子
    const str = '0123456789ABCDEFGHJKLMNPQRTUWXY'
    // 不用I、O、S、V、Z
    for (let i = 0; i < Code.length - 1; i++) {
      Ancode = Code.substring(i, i + 1)
      Ancodevalue = str.indexOf(Ancode)
      total = total + Ancodevalue * weightedfactors[i]
      // 权重与加权因子相乘之和
    }
    let logiccheckcode: string | number = 31 - total % 31
    if (logiccheckcode === 31) {
      logiccheckcode = 0
    }
    const Str = '0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y'
    const Array_Str = Str.split(',')
    logiccheckcode = Array_Str[logiccheckcode]
    const checkcode = Code.substring(17, 18)
    if (logiccheckcode !== checkcode) {
      return '不是有效的统一社会信用编码！'
    }
    return ''
  }
}

/**
 * 格式化日期
 * @param {Date} d
 * @param {string} fmt
 * @returns string
 */
const formatDate = (d: string, fmt: string) => {
  function padLeftZero(str: string) {
    return ('00' + str).substr(str.length)
  }
  if (!d) {
    return ''
  }
  const date = new Date(d)
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  interface O {
    [key: string]: string | number
  }
  const o: O = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

/**
 * 数组组合
 */
{
  const recursionSub = (list: any[], count: number, array: any[], ind: number, start: number, indexs: any[] = []) => {
    start++;
    if(start > count -1) {
      return;
    }
    if(start == 0) {
      indexs = new Array(array.length)
    }
    for (indexs[start] = 0; indexs[start] < array[start].length; indexs[start]++) {
      recursionSub(list, count, array, 0, start, indexs);
      if(start == count - 1) {
        let temp = new Array(count);
        for (let i = count - 1; i >= 0; i--) {
          temp[start - i] = array[start - i][indexs[start - i]];
        }
        list.push(temp);
      }
    }
  }
  const temp = [
    ['S1', 'S2', 'S3'],
    ['H4', 'H5'],
    ['D6', 'D7', 'D8'],
    ['H16', 'H17', 'H18']
  ]
  const list: any[] = []
  recursionSub(list, temp.length, temp, 0, -1)
  console.log(list);
}

/**
 * '4[a]2[bc]2[bcD]0[AB]' // aaaabcbc
 */
{
  const s1 = '4[a]2[bc]2[bcD]0[AB]' // aaaabcbc
  const s2 = '2[3[a]2[bc]]2[cde]' // aaabcbcaaabcbc
  const decodeString = (str: string): Function | string => {
    if (str.indexOf('[') === -1) return str
    let s: string = str
    const list: RegExpMatchArray | null = str.match(/(\d+)(\[([a-z]|[A-Z])+\])/ig)
    let empStr: string = ''
    list && list.map((item: any) => {
      const n: number = parseInt(item)
      const c: any = item.match(/([A-Z]|[a-z])+/)[0]
      const l: number = c && c.length || 0
      s = s.replace(item, empStr.padStart(l*n, c))
    })
    return decodeString(s)
  }
  console.log(decodeString(s1))
}

export {
  IEVersion, getPrefixPathname, getFileType, validStrForPassword, validStrForPhoneNum, validStrForIdentityNum, validateIdCard, formatStrForSafe, validateSocialCreditCode, formatDate,
}
