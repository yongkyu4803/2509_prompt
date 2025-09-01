import { PromptService } from './database';
import { supabase } from './supabase';

// 데이터베이스 연결 테스트
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    console.log('🔗 Testing Supabase connection...');
    
    const { error } = await supabase
      .from('prompts')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error);
    return false;
  }
}

// 테이블 구조 확인
export async function testTableStructure(): Promise<boolean> {
  try {
    console.log('🔍 Testing table structure...');
    
    const { error } = await supabase.rpc('get_table_info', { 
      table_name: 'prompts' 
    });
    
    if (error) {
      // RPC가 없다면 간단한 SELECT로 테스트
      const { error: selectError } = await supabase
        .from('prompts')
        .select('id, title, description, content, category, usage_hours, is_favorite, tags, user_id, created_at, updated_at')
        .limit(0);
      
      if (selectError) {
        console.error('❌ Table structure test failed:', selectError.message);
        return false;
      }
    }
    
    console.log('✅ Table structure is correct');
    return true;
  } catch (error) {
    console.error('❌ Table structure test error:', error);
    return false;
  }
}

// CRUD 기능 테스트
export async function testCRUDOperations(): Promise<boolean> {
  try {
    console.log('🧪 Testing CRUD operations...');
    
    // CREATE 테스트
    console.log('  📝 Testing CREATE...');
    const testPrompt = await PromptService.createPrompt({
      title: 'Test Prompt',
      description: 'This is a test prompt',
      content: 'Test content for database verification',
      category: 'development',
      usageHours: 0,
      isFavorite: false,
      tags: ['test', 'database'],
    });
    
    console.log('  ✅ CREATE successful, ID:', testPrompt.id);
    
    // READ 테스트
    console.log('  📖 Testing READ...');
    const allPrompts = await PromptService.getPrompts();
    const foundPrompt = allPrompts.find(p => p.id === testPrompt.id);
    
    if (!foundPrompt) {
      console.error('  ❌ READ failed: prompt not found');
      return false;
    }
    console.log('  ✅ READ successful');
    
    // UPDATE 테스트
    console.log('  ✏️ Testing UPDATE...');
    const updatedPrompt = await PromptService.updatePrompt(testPrompt.id, {
      title: 'Updated Test Prompt',
      usageHours: 5,
      isFavorite: true,
    });
    
    if (updatedPrompt.title !== 'Updated Test Prompt' || !updatedPrompt.isFavorite) {
      console.error('  ❌ UPDATE failed: values not updated correctly');
      return false;
    }
    console.log('  ✅ UPDATE successful');
    
    // Toggle Favorite 테스트
    console.log('  ⭐ Testing TOGGLE FAVORITE...');
    const toggledPrompt = await PromptService.toggleFavorite(testPrompt.id);
    
    if (toggledPrompt.isFavorite === updatedPrompt.isFavorite) {
      console.error('  ❌ TOGGLE FAVORITE failed: favorite status not changed');
      return false;
    }
    console.log('  ✅ TOGGLE FAVORITE successful');
    
    // DELETE 테스트
    console.log('  🗑️ Testing DELETE...');
    await PromptService.deletePrompt(testPrompt.id);
    
    const deletedCheck = await PromptService.getPrompts();
    const deletedPrompt = deletedCheck.find(p => p.id === testPrompt.id);
    
    if (deletedPrompt) {
      console.error('  ❌ DELETE failed: prompt still exists');
      return false;
    }
    console.log('  ✅ DELETE successful');
    
    console.log('✅ All CRUD operations successful');
    return true;
  } catch (error) {
    console.error('❌ CRUD operations test failed:', error);
    return false;
  }
}

// 전체 데이터베이스 테스트 실행
export async function runDatabaseTests(): Promise<void> {
  console.log('🚀 Starting database tests...\n');
  
  const results = {
    connection: await testDatabaseConnection(),
    structure: await testTableStructure(),
    crud: await testCRUDOperations(),
  };
  
  console.log('\n📊 Test Results:');
  console.log('  Database Connection:', results.connection ? '✅ PASS' : '❌ FAIL');
  console.log('  Table Structure:', results.structure ? '✅ PASS' : '❌ FAIL');
  console.log('  CRUD Operations:', results.crud ? '✅ PASS' : '❌ FAIL');
  
  const allPassed = Object.values(results).every(result => result);
  
  console.log('\n🎯 Overall Result:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
  
  if (allPassed) {
    console.log('🎉 Database is ready for use!');
  } else {
    console.log('⚠️  Please check the database configuration and table setup.');
  }
}