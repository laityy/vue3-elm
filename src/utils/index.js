export const dataStr = (data) => {
    let dataStr = '' //数据拼接字符串
    Object.keys(data).forEach((key) => {
        dataStr += key + '=' + data[key] + '&'
    })

    if (dataStr !== '') {
        dataStr = dataStr.substring(0, dataStr.length - 1)
    }
    return dataStr
}

export const setStorage = (name, item) => localStorage.setItem(name, item)

export const getStorage = (name) => localStorage.getItem(name)
