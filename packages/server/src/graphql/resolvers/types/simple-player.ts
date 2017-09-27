const resolvers = {
  User: {
    __resolveType(obj, context, info){
      if(obj.state){
        return 'Player';
      }
      else {
        return 'Viewer';
      }
    },
  },
};

export default resolvers;