import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
    Container,
    Form,
    Input,
    SubmitButton,
    List,
    User,
    Avatar,
    Name,
    Bio,
    ProfileButton,
    ProfileButtonText,
} from './styles';
import api from '../../services/api';

const Main = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        setLoading(true);
        const response = await api.get(`/users/${newUser}`);

        const data = {
            name: response.data.name,
            login: response.data.login,
            bio: response.data.bio,
            avatar: response.data.avatar_url,
        };

        const newUsers = [...users, data];

        await AsyncStorage.setItem('@users', JSON.stringify(newUsers));

        setUsers(newUsers);
        setNewUser('');
        setLoading(false);

        Keyboard.dismiss();
    }

    function handleNavigate(user) {
        navigation.navigate('User', { user });
    }

    useEffect(() => {
        async function getUsers() {
            const value = await AsyncStorage.getItem('@users');

            if (value !== null) {
                setUsers(JSON.parse(value));
            }
        }

        getUsers();
    }, []);

    return (
        <Container>
            <Form>
                <Input
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholder="Adicionar usuário"
                    value={newUser}
                    onChangeText={text => setNewUser(text)}
                    returnKeyType="send"
                    onSubmitEditing={handleSubmit}
                />
                <SubmitButton loading={loading} onPress={handleSubmit}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Icon name="add" size={20} color="#fff" />
                    )}
                </SubmitButton>
            </Form>
            <List
                data={users}
                keyExtractor={user => user.login}
                renderItem={({ item }) => (
                    <User>
                        <Avatar source={{ uri: item.avatar }} />
                        <Name>{item.name}</Name>
                        <Bio>{item.bio}</Bio>

                        <ProfileButton
                            onPress={() => {
                                handleNavigate(item);
                            }}
                        >
                            <ProfileButtonText>Ver perfil</ProfileButtonText>
                        </ProfileButton>
                    </User>
                )}
            />
        </Container>
    );
};

Main.navigationOptions = {
    title: 'Usuários',
};

Main.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func,
    }).isRequired,
};

export default Main;
