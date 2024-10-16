// // ParentComponent.js
// import React, { useState } from 'react';
// import { View, StyleSheet } from 'react-native';
// import IssueReport from './IssueReport';
// import Forum from './Forum';

// const IssueCategories = () => {
//   const [categories, setCategories] = useState([
//     { label: 'Health Issue', value: 'healthService' },
//     { label: 'Road Safety', value: 'roadSafety' },
//     { label: 'Others', value: 'others' },
//   ]);

//   return (
//     <View style={styles.container}>
//       <IssueReport categories={categories} setCategories={setCategories} />
//       <Forum categories={categories} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

// export default IssueCategories ;
