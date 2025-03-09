import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../../constants/colors';

export default function CaptureScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    // 请求权限
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('需要权限', '需要访问相册的权限来选择图片');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // 请求权限
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('需要权限', '需要访问相机的权限来拍照');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert('错误', '请先拍照或选择图片');
      return;
    }

    setUploading(true);

    // 模拟上传过程
    setTimeout(() => {
      setUploading(false);
      router.push('/dashboard/analysis');
    }, 2000);

    // 实际开发中，这里应该调用上传API
    // try {
    //   // 创建FormData
    //   const formData = new FormData();
    //   formData.append('image', {
    //     uri: image,
    //     type: 'image/jpeg',
    //     name: 'upload.jpg',
    //   });
    
    //   // 发送请求
    //   const response = await fetch('api/image/upload', {
    //     method: 'POST',
    //     body: formData,
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //       'Authorization': `Bearer ${userToken}`, // 假设已获取用户Token
    //     },
    //   });
    
    //   const data = await response.json();
    //   if (data.task_id) {
    //     // 存储task_id并跳转到分析结果页面
    //     router.push({
    //       pathname: '/dashboard/analysis',
    //       params: { taskId: data.task_id }
    //     });
    //   } else {
    //     Alert.alert('上传失败', data.message || '请重试');
    //   }
    // } catch (error) {
    //   console.error(error);
    //   Alert.alert('错误', '上传过程中发生错误');
    // } finally {
    //   setUploading(false);
    // }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>拍照识题</Text>
        <Text style={styles.subtitle}>拍照或上传一张题目图片进行智能解析</Text>
      </View>

      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>📷</Text>
            <Text style={styles.placeholderInfo}>请拍照或从相册选择图片</Text>
          </View>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
          <Text style={styles.actionButtonText}>拍照</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
          <Text style={styles.actionButtonText}>从相册选择</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[
          styles.uploadButton, 
          !image && styles.uploadButtonDisabled,
          uploading && styles.uploadingButton
        ]}
        onPress={uploadImage}
        disabled={!image || uploading}
      >
        <Text style={styles.uploadButtonText}>
          {uploading ? '正在上传...' : '上传并解析'}
        </Text>
      </TouchableOpacity>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>拍照小技巧：</Text>
        <Text style={styles.tip}>1. 确保光线充足，避免阴影遮挡</Text>
        <Text style={styles.tip}>2. 尽量保持图像平整，避免弯曲</Text>
        <Text style={styles.tip}>3. 将题目置于画面中央</Text>
        <Text style={styles.tip}>4. 确保图像清晰，文字可读</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  header: {
    marginTop: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  imageContainer: {
    aspectRatio: 4/3,
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
    marginBottom: 12,
    color: Colors.textSecondary,
  },
  placeholderInfo: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    width: '48%',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  uploadButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  uploadingButton: {
    backgroundColor: Colors.textSecondary,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.text,
  },
  tip: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
});
