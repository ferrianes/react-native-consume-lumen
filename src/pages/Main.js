import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { 
    ActivityIndicator,
    Alert,
    Button,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableHighlight,
    View 
} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay';

const Main = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
    const [namaKategori, setNamaKategori] = useState('');
    const [kategori, setKategori] = useState([]);
    const [button, setButton] = useState('');
    const [idKategori, setIdKategori] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    const submit = async () => {
        const data = {
            nama_kategori: namaKategori
        }

        const headers = {
            headers: {
                token: 'keymasuk'
            }
        }

        setLoading(true);
        try {
            await Axios.post('http://192.168.0.7:8000/kategori', data, headers);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            Alert.alert(e.message);
        }

        await getData();
        setNamaKategori('');
        setModalVisible(false);

        ToastAndroid.show("Kategori sukses ditambahkan !", ToastAndroid.SHORT);
    }

    const update = async () => {
        const data = {
            nama_kategori: namaKategori
        }

        const headers = {
            headers: {
                token: 'keymasuk'
            }
        }

        setLoading(true);
        try {
            await Axios.put(`http://192.168.0.7:8000/kategori/${idKategori}`, data, headers);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            Alert.alert(e.message);
        }

        await getData();
        setNamaKategori('');
        setIdKategori('');
        setModalVisible(false);

        ToastAndroid.show("Kategori sukses diedit !", ToastAndroid.SHORT);
    }

    const destroy = async () => {

        const headers = {
            headers: {
                token: 'keymasuk'
            }
        }

        setLoading(true);

        try {
            await Axios.delete(`http://192.168.0.7:8000/kategori/${idKategori}`, headers);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            Alert.alert(e.message);
        }

        await getData();
        setIdKategori('');
        setModalDeleteVisible(false);

        ToastAndroid.show("Kategori sukses dihapus!", ToastAndroid.SHORT);
    }

    const getData = async () => {
        const headers = {
            headers: {
                token: 'keymasuk'
            }
        }

        setLoading(true);

        try {
            await Axios.get('http://192.168.0.7:8000/kategori', headers)
                        .then(res => setKategori(res.data))
            setLoading(false);
        } catch (e) {
            setLoading(false);
            Alert.alert(e.message);
        }
    }

    const openEditModal = (data) => {
        setButton('Update');

        setIdKategori(data.id_kategori);
        setNamaKategori(data.nama_kategori);
        
        setModalVisible(true);
    }

    const confirmDelete = (data) => {
        setIdKategori(data.id_kategori);
        setNamaKategori(data.nama_kategori);
        
        setModalDeleteVisible(true);
    }

    return (
        <ScrollView>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
                color='#0000ff'
            />
            <View style={styles.container}>
                <Text style={styles.textTitle}>Data Kategori Pustaka</Text>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    }}
                >
                    <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Nama Kategori</Text>
                        <TextInput style={styles.modalTextInput} value={namaKategori} onChangeText={(value) => setNamaKategori(value)} />

                        <View style={styles.actionView}>
                            <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: "#ed5353", marginRight: 5 }}
                            onPress={() => {
                                setNamaKategori('');
                                setModalVisible(!modalVisible);
                            }}
                            >
                                <Text style={styles.textStyle}>Close</Text>
                            </TouchableHighlight>

                            <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                            onPress={ button =='Save' ? submit : update}
                            >
                                <Text style={styles.textStyle}>{button}</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalDeleteVisible}
                    onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    }}
                >
                    <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Anda yakin ingin menghapus data {namaKategori} ?</Text>
                        <View style={styles.actionView}>
                            <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: "#ed5353", marginRight: 5 }}
                            onPress={() => {
                                setNamaKategori('');
                                setModalDeleteVisible(!modalDeleteVisible);
                            }}
                            >
                                <Text style={styles.textStyle}>Close</Text>
                            </TouchableHighlight>

                            <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                            onPress={ destroy }
                            >
                                <Text style={styles.textStyle}>Delete</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    </View>
                </Modal>

                <TouchableHighlight
                    style={styles.openButton}
                    onPress={() => {
                        setButton('Save');
                        setModalVisible(true);
                    }}
                >
                    <Text style={styles.textStyle}>Tambah Kategori</Text>
                </TouchableHighlight>

                <View>
                    {console.log(kategori)}
                    <View style={styles.dataKategori}>
                        <Text style={styles.textNumber}>No.</Text>
                        <Text style={styles.textNama}>Nama Kategori.</Text>
                    </View>
                    { 
                        kategori.map((k, key) => {
                            return (
                                <View style={styles.dataKategori} key={key}>
                                    <Text style={styles.textNumber}>{key + 1}.</Text>
                                    <Text style={{...styles.textNama, width: '50%'}}>{k.nama_kategori}</Text>
                                    <View style={styles.buttonWrapper}>
                                        <TouchableHighlight style={styles.buttonEdit} onPress={() => openEditModal(k)}>
                                            <Text style={{ color: 'white' }}>Edit</Text>
                                        </TouchableHighlight>
                                        <TouchableHighlight style={styles.buttonDelete} onPress={() => confirmDelete(k)}>
                                            <Text style={{ color: 'white' }}>Hapus</Text>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        </ScrollView>
    )
}

export default Main

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    textTitle: {
        textAlign: 'center',
        marginBottom: 20
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "teal",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginBottom: 20,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    modalTextInput: {
        borderWidth: 2,
        borderColor: 'gray',
        borderRadius: 10,
        padding: 10,
        width: 200,
        marginBottom: 15,
    },
    actionView: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    dataKategori: {
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'center',
        backgroundColor: '#f9c440',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 10
    },
    textNumber: {
        width: '10%',
    },
    textNama: {
        width: '90%',
    },
    buttonWrapper: {
        flexDirection: 'row',
        width: '40%',
        justifyContent: 'flex-end'
    },
    buttonEdit: {
        backgroundColor: "#3689e6",
        borderRadius: 5,
        padding: 10,
        marginRight: 5
    },
    buttonDelete: {
        backgroundColor: "#c6262e",
        borderRadius: 5,
        padding: 10,
    },
    spinnerTextStyle: {
        color: 'white',
    }
})
