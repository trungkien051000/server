import { StatusBar } from 'expo-status-bar';
import {Component} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
class App extends Component {
  constructor() {
    super();
    this.state = {
      dataSV: [],
    };
  }
  dnPost() {
    var url = 'http://192.85.40.135:3001/data';
    axios.post(url, {
      MaNhanVien: this.state.input1,
      MaKhachHang: this.state.input2,
      MaBinhLuan: this.state.input3,
      TieuDe: this.state.input4,
      MoTa: this.state.input5
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
      this.state.input1 = '';
      this.state.input2 = '';
      this.state.input3 = '';
      this.state.input4 = '';
      this.state.input5 = '';
  };
  dnGet() {
    var url = 'http://192.85.40.135:3001/data';
    axios.get(url)
      .then((aData) => {
        console.log(aData.data);
        this.setState({
          dataSV: aData.data,
        })
      })
  };
  render() {
    const dataMySQL = this.state.dataSV.map((item, index) => {
      var arraySV = ['MaNV: ', item.MaNhanVien, ' - MaKH: ', item.MaKhachHang, ' - MaBL: ', item.MaBinhLuan, ' - Tieu de: ', item.TieuDe, ' - Mo ta: ', item.MoTa].join(' ');
      return <Text style={{ fontSize: 20, fontWeight: 'bold' }} key={index}>{arraySV}</Text>
    });
    return (
      <View>
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Text style={{ marginTop: 20, fontSize: 20, fontWeight: 'bold' }}>React Native vs NodeJs</Text>
          <TextInput
            placeholder='Hay nhap ma nhan vien'
            style={{ height: 50, width: 300, fontSize: 15 }}
            onChangeText={(input1) => this.setState({ input1 })}
            value={this.state.input1}
          />
          <TextInput
            placeholder='Hay nhap ma khach hang'
            style={{ height: 50, width: 300, fontSize: 15 }}
            onChangeText={(input2) => this.setState({ input2 })}
            value={this.state.input2}
          />
          <TextInput
            placeholder='Hay nhap ma binh luan'
            style={{ height: 50, width: 300, fontSize: 15 }}
            onChangeText={(input3) => this.setState({ input3 })}
            value={this.state.input3}
          />
          <TextInput
            placeholder='Hay nhap tieu de'
            style={{ height: 50, width: 300, fontSize: 15 }}
            onChangeText={(input4) => this.setState({ input4 })}
            value={this.state.input4}
          />
          <TextInput
            placeholder='Hay nhap mota'
            style={{ height: 50, width: 300, fontSize: 15 }}
            onChangeText={(input5) => this.setState({ input5 })}
            value={this.state.input5}
          />
        </View>
        {/* ----------*/}
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'red', borderRadius: 15, flex: 1, width: 100, height: 50, margin: 20,
              flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
            }}
            onPress={this.dnPost.bind(this)}
          >
            <Text style={{ fontSize: 20, color: 'green', fontWeight: 'bold' }}>
              POST
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: 'yellow', borderRadius: 15, flex: 1, width: 100, height: 50, margin: 20,
              flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
            }}
            onPress={this.dnGet.bind(this)}
          >
            <Text style={{ fontSize: 20, color: 'orange', fontWeight: 'bold' }}>
              GET
            </Text>
          </TouchableOpacity>
        </View>
        {/* ----------*/}
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          {dataMySQL}
        </View>
        {/* ----------*/}
      </View>
    );
  }
}
export default App;