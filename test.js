const aaa = ['111', '222','333']
aaa.forEach((item) => {
    if (item.includes('222')) return
    console.log(item);
})