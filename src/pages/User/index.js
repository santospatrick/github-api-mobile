import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
    Container,
    Header,
    Avatar,
    Name,
    Bio,
    StarsList,
    Starred,
    OwnerAvatar,
    Info,
    Title,
    Author,
} from './styles';
import api from '../../services/api';

const User = ({ navigation }) => {
    const user = navigation.getParam('user');
    const [stars, setStars] = useState([]);

    useEffect(() => {
        async function getStarredRepos() {
            const response = await api.get(`/users/${user.login}/starred`);
            setStars(response.data);
        }
        getStarredRepos();
    }, []);

    return (
        <Container>
            <Header>
                <Avatar source={{ uri: user.avatar }} />
                <Name>{user.name}</Name>
                <Bio>{user.bio}</Bio>
            </Header>

            <StarsList
                data={stars}
                keyExtractor={star => String(star.id)}
                renderItem={({ item }) => (
                    <Starred>
                        <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                        <Info>
                            <Title>{item.name}</Title>
                            <Author>{item.owner.login}</Author>
                        </Info>
                    </Starred>
                )}
            />
        </Container>
    );
};

User.propTypes = {
    navigation: PropTypes.shape({
        getParam: PropTypes.func,
    }).isRequired,
};

User.navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
});

export default User;
