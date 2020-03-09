const getFive = () => 5; // eslint-disable-line no-magic-numbers

const getSixAsynchronously = async () => {
    const result = await getFive();
    return result + 1;
};

export default getSixAsynchronously;
