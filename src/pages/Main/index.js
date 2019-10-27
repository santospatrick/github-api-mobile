import React, { useState } from 'react';
import { Keyboard } from 'react-native';
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

const Main = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState('');

    async function handleSubmit() {
        const response = await api.get(`/users/${newUser}`);

        const data = {
            name: response.data.name,
            login: response.data.login,
            bio: response.data.bio,
            avatar: response.data.avatar_url,
        };

        setUsers([...users, data]);
        setNewUser('');

        Keyboard.dismiss();
    }

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
                <SubmitButton onPress={handleSubmit}>
                    <Icon name="add" size={20} color="#fff" />
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

                        <ProfileButton onPress={() => {}}>
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

export default Main;
