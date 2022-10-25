var express = require('express');
var app = express();

var mysql = require('mysql');
var bodyParser = require('body-parser');
const Api = require('mysqli/lib/api');

app.use(bodyParser.json({ type: 'application/json' }))
app.use(bodyParser.urlencoded({ extended: true }));

var con = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    port: 3307,
    database: 'quanlybaotri'
});

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
});

con.connect(function (error) {
    if (error) console.log(error);
    else console.log('connected')
})

function getNhanVien(Id, callback) {
    return con.query('SELECT *  from nhanvien left join diachi on diachi.MaDiaChi = nhanvien.MaDiaChi left join phuong on diachi.MaPhuong = phuong.MaPhuong left join quan on phuong.MaQuan = quan.MaQuan left join thanhpho on quan.MaTP = thanhpho.MaTP where nhanvien.MaNhanVien = ?', Id, callback);
}

function getKhachHang(Id, callback) {
    return con.query('SELECT *,diachi.DiaChi,phuong.TenPhuong,quan.TenQuan,thanhpho.TenTP' 
   + ' from khachhang left join diachi on diachi.MaDiaChi = khachhang.MaDiaChi left join phuong on diachi.MaPhuong = phuong.MaPhuong left join quan on phuong.MaQuan = quan.MaQuan left join thanhpho on quan.MaTP = thanhpho.MaTP' 
   + ' where khachhang.MaKhachHang = ?', Id, callback);
}

function getThietBiKH(ID,callback) {
    return con.query('SELECT TenThietBi from thietbi left join thietbikh on  thietbikh.MaThietBi=thietbi.MaThietBi left join khachhang on khachhang.MaKhachHang = thietbikh.MaKhachHang where khachhang.MaKhachhang = ?', ID, callback)
}

function updateKhachHang(Id, HoTen, MatKhau, SoDienThoai,DoanhNghiep, callback) {
    return con.query('UPDATE khachhang SET HoTen = N? , MatKhau = ? , DienThoai = ? , DoanhNghiep = N? where MaKhachHang = ?',[HoTen,MatKhau,SoDienThoai,DoanhNghiep,Id  ],callback);
}

function updateNhanVien(Id, HoTen, MatKhau, SoDienThoai,NgaySinh, callback) {
    return con.query('UPDATE nhanvien SET HoTen = N? , MatKhau = ? , DienThoai = ? , NgaySinh = ? where MaNhanVien = ?',[HoTen,MatKhau,SoDienThoai,NgaySinh,Id  ],callback);
}

function getMaxBaoTri(callback) {
    return con.query('SELECT MAX(MaBaoTri) + 1 as maxMa  FROM baotri', callback);
}

function countBaoTriKH(ID, callback) {
    return con.query('SELECT Count(MaBaoTri) as count FROM baotri WHERE baotri.MaDuyetBT = 3 AND MaKhachHang= ?',ID, callback);
}

function countBaoTriKHChuaDuyet(ID, callback) {
    return con.query('SELECT Count(MaBaoTri) as count FROM baotri WHERE baotri.MaDuyetBT = 1 AND MaKhachHang= ?',ID, callback);
}

function countBaoTriKHHoanThanh(ID, callback) {
    return con.query('SELECT Count(baotri.MaBaoTri) as count FROM baotri, chitietbaotri WHERE baotri.MaDuyetBT = 3 AND baotri.MaBaoTri = chitietbaotri.MaBaoTri AND chitietbaotri.MaTrangThai=3 AND MaKhachHang= ?',ID, callback);
}

function countBaoTriNV(ID, callback) {
    return con.query('SELECT Count(MaBaoTri) as count FROM baotri WHERE baotri.MaDuyetBT = 3 AND MaNhanVien= ?',ID, callback);
}

function getMaxBinhLuan(callback) {
    return con.query('SELECT MAX(MaBinhLuan) as maxMa  FROM binhluan', callback);
}

function getBaoTriNV(Id, callback) {
    return con.query('SELECT nhanvien.MaNhanVien, khachhang.MaKhachHang,khachhang.DienThoai, thietbi.MaThietBi, baotri.MaBaoTri,nhanvien.HoTen as htnv,khachhang.HoTen as htkh,binhluan.NoiDung,baotri.TieuDe,baotri.MoTa,thietbi.TenThietBi,chitietbaotri.NgayBatDau,chitietbaotri.NgayKetThuc,chitietbaotri.NgayHoanThanh,chitietbaotri.TienDo,trangthai.MaTrangThai,trangthai.TrangThai,diachi.DiaChi,phuong.TenPhuong,quan.TenQuan,thanhpho.TenTP' 
    +' from baotri left join nhanvien on nhanvien.MaNhanVien = baotri.MaNhanVien left join khachhang on khachhang.MaKhachHang =baotri.MaKhachHang' 
    +' left join chitietbaotri on chitietbaotri.MaBaoTri = baotri.MaBaoTri left join diachi on diachi.MaDiaChi = khachhang.MaDiaChi' 
    +' left join binhluan on binhluan.MaBinhLuan = baotri.MaBinhLuan left join thietbi on thietbi.MaThietBi = chitietbaotri.MaThietBi'
    +' left join phuong on diachi.MaPhuong = phuong.MaPhuong left join quan on phuong.MaQuan = quan.MaQuan left join thanhpho on quan.MaTP = thanhpho.MaTP'
    +' left join trangthai on chitietbaotri.MaTrangThai = trangthai.MaTrangThai'
    +' where baotri.MaDuyetBT = 3 AND  nhanvien.MaNhanVien = ?', Id, callback);
}

function getBaoTriKH(Id, callback) {
    return con.query('SELECT nhanvien.MaNhanVien, khachhang.MaKhachHang,nhanvien.DienThoai, thietbi.MaThietBi, baotri.MaBaoTri,baotri.MaDuyetBT,nhanvien.HoTen as htnv,khachhang.HoTen as htkh,binhluan.MaBinhLuan, binhluan.NoiDung,baotri.TieuDe,baotri.MoTa,thietbi.TenThietBi,chitietbaotri.NgayBatDau,chitietbaotri.NgayKetThuc,chitietbaotri.NgayHoanThanh,chitietbaotri.TienDo,trangthai.TrangThai,diachi.DiaChi,phuong.TenPhuong,quan.TenQuan,thanhpho.TenTP' 
    +' from baotri left join nhanvien on nhanvien.MaNhanVien = baotri.MaNhanVien left join khachhang on khachhang.MaKhachHang =baotri.MaKhachHang' 
    +' left join chitietbaotri on chitietbaotri.MaBaoTri = baotri.MaBaoTri left join diachi on diachi.MaDiaChi = khachhang.MaDiaChi' 
    +' left join binhluan on binhluan.MaBinhLuan = baotri.MaBinhLuan left join thietbi on thietbi.MaThietBi = chitietbaotri.MaThietBi'
    +' left join phuong on diachi.MaPhuong = phuong.MaPhuong left join quan on phuong.MaQuan = quan.MaQuan left join thanhpho on quan.MaTP = thanhpho.MaTP'
    +' left join trangthai on chitietbaotri.MaTrangThai = trangthai.MaTrangThai'
    +' where baotri.MaDuyetBT = 3 AND  khachhang.MaKhachHang = ?', Id, callback);
}

function getBaoTriKHChuaDuyet(Id, callback) {
    return con.query('SELECT nhanvien.MaNhanVien, khachhang.MaKhachHang,nhanvien.DienThoai, thietbi.MaThietBi, baotri.MaBaoTri,baotri.MaDuyetBT,nhanvien.HoTen as htnv,khachhang.HoTen as htkh,binhluan.MaBinhLuan, binhluan.NoiDung,baotri.TieuDe,baotri.MoTa,thietbi.TenThietBi,chitietbaotri.NgayBatDau,chitietbaotri.NgayKetThuc,chitietbaotri.NgayHoanThanh,chitietbaotri.TienDo,trangthai.TrangThai,diachi.DiaChi,phuong.TenPhuong,quan.TenQuan,thanhpho.TenTP' 
    +' from baotri left join nhanvien on nhanvien.MaNhanVien = baotri.MaNhanVien left join khachhang on khachhang.MaKhachHang =baotri.MaKhachHang' 
    +' left join chitietbaotri on chitietbaotri.MaBaoTri = baotri.MaBaoTri left join diachi on diachi.MaDiaChi = khachhang.MaDiaChi' 
    +' left join binhluan on binhluan.MaBinhLuan = baotri.MaBinhLuan left join thietbi on thietbi.MaThietBi = chitietbaotri.MaThietBi'
    +' left join phuong on diachi.MaPhuong = phuong.MaPhuong left join quan on phuong.MaQuan = quan.MaQuan left join thanhpho on quan.MaTP = thanhpho.MaTP'
    +' left join trangthai on chitietbaotri.MaTrangThai = trangthai.MaTrangThai'
    +' where baotri.MaDuyetBT = 1 AND  khachhang.MaKhachHang = ?', Id, callback);
}

function getBaoTriKHHoanThanh(Id, callback) {
    return con.query('SELECT nhanvien.MaNhanVien, khachhang.MaKhachHang,nhanvien.DienThoai, thietbi.MaThietBi, baotri.MaBaoTri,baotri.MaDuyetBT,nhanvien.HoTen as htnv,khachhang.HoTen as htkh,binhluan.MaBinhLuan, binhluan.NoiDung,baotri.TieuDe,baotri.MoTa,thietbi.TenThietBi,chitietbaotri.NgayBatDau,chitietbaotri.NgayKetThuc,chitietbaotri.NgayHoanThanh,chitietbaotri.TienDo,trangthai.TrangThai,diachi.DiaChi,phuong.TenPhuong,quan.TenQuan,thanhpho.TenTP' 
    +' from baotri left join nhanvien on nhanvien.MaNhanVien = baotri.MaNhanVien left join khachhang on khachhang.MaKhachHang =baotri.MaKhachHang' 
    +' left join chitietbaotri on chitietbaotri.MaBaoTri = baotri.MaBaoTri left join diachi on diachi.MaDiaChi = khachhang.MaDiaChi' 
    +' left join binhluan on binhluan.MaBinhLuan = baotri.MaBinhLuan left join thietbi on thietbi.MaThietBi = chitietbaotri.MaThietBi'
    +' left join phuong on diachi.MaPhuong = phuong.MaPhuong left join quan on phuong.MaQuan = quan.MaQuan left join thanhpho on quan.MaTP = thanhpho.MaTP'
    +' left join trangthai on chitietbaotri.MaTrangThai = trangthai.MaTrangThai'
    +' where chitietbaotri.MaTrangThai = 3 AND baotri.MaDuyetBT = 3 AND  khachhang.MaKhachHang = ?', Id, callback);
}

function loginKH(username,password, callback) {
    return con.query('SELECT * from khachhang where TaiKhoan = ? AND MatKhau = ?', [username, password], callback);
}

function loginNV(username,password, callback) {
    return con.query('SELECT * from nhanvien where TaiKhoan = ? AND MatKhau = ?', [username, password], callback);
}

function updateBaoTriKH(MaBinhLuan, NoiDung, callback) {
    return con.query('UPDATE binhluan set NoiDung = ? where MaBinhLuan = ?', [NoiDung, MaBinhLuan], callback);
}

function createBinhLuanKH(MaBinhLuan, callback) {
    return con.query('INSERT INTO `binhluan` (`MaBinhLuan`) VALUES (?)', MaBinhLuan, callback);
}

function updateBaoTriNV(MaBaoTri, NgayBatDau, NgayKetThuc, NgayHoanThanh, TienDo, MaTrangThai, callback) {
    var data =[NgayBatDau, NgayKetThuc, NgayHoanThanh, TienDo, MaTrangThai, MaBaoTri];
    return con.query("UPDATE chitietbaotri set NgayBatDau = ?, NgayKetThuc = ?, NgayHoanThanh = ?, TienDo = ?, MaTrangThai = ? where MaBaoTri = ?", [NgayBatDau, NgayKetThuc, NgayHoanThanh, TienDo, MaTrangThai, MaBaoTri], callback);
}

function maxMaBinhLuan(callback) {
    return con.query('SELECT MAX(MaBinhLuan) as maxMaBL  FROM binhluan', callback);
}
app.get('/nhanvien/:id', function (req, res) {
    getNhanVien(req.params.id, function (error, rows, fields) {
        if (error) console.log(error);
        else {
            res.send(rows);
        }
    })
})

app.get('/khachhang/:id', function (req, res) {
    getKhachHang(req.params.id, function (error, rows, fields) {
        if (error) console.log(error);
        else {
            res.send(rows);
        }
    })
})

app.get('/thietbikh/:id', function (req, res) {
    getThietBiKH(req.params.id, function (error, rows, fields) {
        if (error) console.log(error);
        else {
            res.send(rows);
        }
    })
})

app.get('/countbaotri/:id', function (req, res) {
    countBaoTriKH(req.params.id, function (error, rows, fields){
        if(error) console.log(error);
        else {
            res.send(rows);
        }
    })
})

app.get('/countbaotriChuaDuyet/:id', function (req, res) {
    countBaoTriKHChuaDuyet(req.params.id, function (error, rows, fields){
        if(error) console.log(error);
        else {
            res.send(rows);
        }
    })
})

app.get('/countbaotriHoanThanh/:id', function (req, res) {
    countBaoTriKHHoanThanh(req.params.id, function (error, rows, fields){
        if(error) console.log(error);
        else {
            res.send(rows);
        }
    })
})

app.get('/countbaotriNV/:id', function (req, res) {
    countBaoTriNV(req.params.id, function (error, rows, fields){
        if(error) console.log(error);
        else {
            res.send(rows);
        }
    })
})
app.get('/maxBaoTri', function (req, res) {
    getMaxBaoTri(function (error, rows, fields) {
        if (error) console.log(error);
        else {
            res.send(rows);
        }
    })
})

app.get('/maxBinhLuan', function (req, res) {
    getMaxBinhLuan(function (error, rows, fields) {
        if (error) console.log(error);
        else {
            res.send(rows);
        }
    })
})

app.get('/baotriNV/:id', function (req, res) {
    getBaoTriNV(req.params.id, function (error, rows, fields) {
        if (error) console.log(error);
        else {
            res.send(rows);
        }
    })
})

app.get('/baotriKH/:id', function (req, res) {
    getBaoTriKH(req.params.id, function (error, rows, fields) {
        if (error) console.log(error);
        else {
            res.send(rows);
        }
    })
})

app.get('/baotriKHChuaDuyet/:id', function (req, res) {
    getBaoTriKHChuaDuyet(req.params.id, function (error, rows, fields) {
        if (error) console.log(error);
        else {
            res.send(rows);
        }
    })
})

app.get('/baotriKHHoanThanh/:id', function (req, res) {
    getBaoTriKHHoanThanh(req.params.id, function (error, rows, fields) {
        if (error) console.log(error);
        else {
            res.send(rows);
        }
    })
})

app.post('/loginKH', function (req, res) {
	const username = req.body.username;
    const password = req.body.password;
    loginKH(username, password, function (err, result) {
        if (err) {
            res.send({err: err});
        }
        if (result) {
            res.send(result);
        } else {
            res.send({message: "Wrong username/password combination!"});
        }
    })
});

app.post('/loginNV', function (req, res) {
	const username = req.body.username;
    const password = req.body.password;
    loginNV(username, password, function (err, result) {
        if (err) {
            res.send({err: err});
        }
        if (result) {
            res.send(result);
        } else {
            res.send({message: "Wrong username/password combination!"});
        }
    })
});

app.post('/baotri', function (req, res) {
    const MaKhachHang = req.body.makhachhang;
    const TieuDe = req.body.tieude;
    const MoTa = req.body.mota;
    const MaBinhLuan = req.body.mabinhluan;
    console.log(MaBinhLuan);
    con.query("INSERT INTO baotri(MaDuyetBT,MaKhachHang,TieuDe,MoTa,MaBinhLuan) VALUES(1,?,?,?,?)",[MaKhachHang,TieuDe,MoTa,MaBinhLuan], (err,result) =>{
        if(err) throw err;
        res.send(result);
    });
})

app.post('/chitietbaotri', function (req, res) {
    const MaBaoTri = req.body.mabaotri;
    const NgayBatDau = req.body.ngay;
    const MaThietBi = req.body.mathietbi;
    console.log(NgayBatDau);
    con.query("INSERT INTO chitietbaotri(MaBaoTri, MaThietBi, NgayBatDau) VALUES(?,?,?)",[MaBaoTri,MaThietBi,NgayBatDau], (err,result) =>{
        if(err) throw err;
        res.send(result);
    });
});

app.post('/baotriKH/binhluan', function (req, res) {
	const MaBinhLuan = req.body.mabinhluan;
    createBinhLuanKH(MaBinhLuan, (err,result) =>{
        if(err){
            
            console.log('ERROR: LOI BINHLUAN', err);
        }else {
            res.send(result);
        }
    })
});

app.put('/baotriKH/update', function (req, res) {
	const MaBinhLuan = req.body.mabinhluan;
    const NoiDung = req.body.noidung;
    updateBaoTriKH(MaBinhLuan, NoiDung, (err,result) =>{
        if(err){
            console.log('ERROR:', err);
        }else {
            res.send(result);
        }
    })
});

app.put('/baotriNV/update', function (req, res) {
	const MaBaoTri = req.body.mabaotri;
    const NgayBatDau = req.body.ngaybd;
    const NgayKetThuc = req.body.ngaykt;
    const NgayHoanThanh = req.body.ngayht;
    const MaTrangThai = req.body.matrangthai;
    const TienDo = req.body.tiendo;
    console.log('MaBaoTri',MaBaoTri);
    console.log('NgayBatDau',NgayBatDau);
    console.log('NgayKetThuc',NgayKetThuc);
    console.log('NgayHoanThanh',NgayHoanThanh);
    console.log('NgayHoanThanh',NgayHoanThanh);
    console.log('MaTrangThai',MaTrangThai);
    console.log('TienDo',TienDo);
    updateBaoTriNV(MaBaoTri, NgayBatDau,NgayKetThuc,NgayHoanThanh ,TienDo, MaTrangThai, (err,result) =>{
        if(err){
            console.log('ERROR:', err);
        }else {
            res.send(result);
        }
    })
});

app.put('/khachhang/update/:id', function (req, res) {
	const HoTen = req.body.hoten;
    const MatKhau = req.body.matkhau;
    const DienThoai = req.body.dienthoai;
    const DoanhNghiep = req.body.doanhnghiep
    updateKhachHang(req.params.id, HoTen, MatKhau, DienThoai,DoanhNghiep, (err,result) =>{
        if(err){
            console.log('ERROR:', err);
        }else {
            res.send(result);
        }
    })
});

app.put('/nhanvien/update/:id', function (req, res) {
	const HoTen = req.body.hoten;
    const MatKhau = req.body.matkhau;
    const DienThoai = req.body.dienthoai;
    const NgaySinh = req.body.ngaysinh
    updateNhanVien(req.params.id, HoTen, MatKhau, DienThoai,NgaySinh, (err,result) =>{
        if(err){
            console.log('ERROR:', err);
        }else {
            res.send(result);
        }
    })
});


// var sql1 = "INSERT INTO baotri(MaKhachHang,TieuDe,MoTa) VALUES(?,?,?)";
//     var sql2 = "INSERT INTO chitietbaotri(MaBaoTri, NgayBatDau) VALUES(?,?)";





// const express = require('express');
// const mysql = require('mysql');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// app.use(bodyParser.json());
// app.use(cors());

// const db = mysql.createConnection({
//      host:'127.0.0.1',
//      user: 'root',
//      password:'',
//      port:3307,
//      database: 'testapi'
// });
// db.connect();
// //xu ly get
// app.get('/data',(req,res)=>{
//     var sql = 'select * from sinhvien';
//     db.query(sql,(err,result)=>{
//         if(err) throw err;
//         console.log(result);
//         res.send(result); // gui ket qua cho react
//     });
// });
// //xu ly post(insert)
// app.post('/data',(req,res)=>{
//     console.log(req.body);
//     var data ={name:req.body.name, age:req.body.age};
//     var sql= 'insert into sinhvien SET ?';
//     db.query(sql,data,(err,result)=>{
//         if(err) throw err;
//         console.log(result);
//         res.send({
//             status:'Du lieu da gui thanh cong',
//             no: null,
//             name: req.body.name,
//             age: req.body.age
//         });
//     });
// });
// app.listen(3001,'192.85.40.135',()=>{
//     console.log('server dang chay o cong 3001');
// })

