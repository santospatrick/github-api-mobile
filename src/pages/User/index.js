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
    Loading,
} from './styles';
import api from '../../services/api';

const User = ({ navigation }) => {
    const user = navigation.getParam('user');
    const [stars, setStars] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    async function load(newPage = 1) {
        try {
            const response = await api.get(`/users/${user.login}/starred`, {
                params: { page: newPage },
            });

            if (newPage >= 2) {
                setStars([...stars, ...response.data]);
            } else {
                setStars(response.data);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    function loadMore() {
        const nextPage = page + 1;
        setPage(nextPage);
        load(nextPage);
    }

    function refresh() {
        setRefreshing(true);
        setStars([]);
        load();
    }

    return (
        <Container>
            <Header>
                <Avatar source={{ uri: user.avatar }} />
                <Name>{user.name}</Name>
                <Bio>{user.bio}</Bio>
            </Header>

            {loading ? (
                <Loading />
            ) : (
                <StarsList
                    data={stars}
                    keyExtractor={star => String(star.id)}
                    renderItem={({ item }) => (
                        <Starred
                            onPress={() =>
                                navigation.navigate('Repository', {
                                    repository: item,
                                })
                            }
                        >
                            <OwnerAvatar
                                source={{ uri: item.owner.avatar_url }}
                            />
                            <Info>
                                <Title>{item.name}</Title>
                                <Author>{item.owner.login}</Author>
                            </Info>
                        </Starred>
                    )}
                    onRefresh={refresh}
                    refreshing={refreshing}
                    onEndReachedThreshold={0.2}
                    onEndReached={loadMore}
                />
            )}
        </Container>
    );
};

User.propTypes = {
    navigation: PropTypes.shape({
        getParam: PropTypes.func,
        navigate: PropTypes.func,
    }).isRequired,
};

User.navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
});

export default User;
