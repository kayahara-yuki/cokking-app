'use client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CookCard from './cook-card';
import { useState, KeyboardEvent } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { Ingredient } from '@/types/recipes';
import { useRouter } from 'next/navigation';
import { generateRecipe } from '@/actions/recipe';

const categories = [
  {
    name: '野菜',
    value: 'vegetable',
    items: [
      {
        id: 'vegetable-1',
        name: 'ジャガイモ',
        image: '/images/asuparagasu.png',
      },
      { id: 'vegetable-2', name: 'トマト', image: '/images/asuparagasu.png' },
      { id: 'vegetable-3', name: 'ねぎ', image: '/images/asuparagasu.png' },
      { id: 'vegetable-4', name: 'ねぎ', image: '/images/asuparagasu.png' },
      { id: 'vegetable-5', name: 'ねぎ', image: '/images/asuparagasu.png' },
      { id: 'vegetable-6', name: 'ねぎ', image: '/images/asuparagasu.png' },
      { id: 'vegetable-7', name: 'ねぎ', image: '/images/asuparagasu.png' },
      { id: 'vegetable-8', name: 'ねぎ', image: '/images/asuparagasu.png' },
      { id: 'vegetable-9', name: 'ねぎ', image: '/images/asuparagasu.png' },
      { id: 'vegetable-10', name: 'ねぎ', image: '/images/asuparagasu.png' },
      { id: 'vegetable-11', name: 'ねぎ', image: '/images/asuparagasu.png' },
      { id: 'vegetable-12', name: 'ねぎ', image: '/images/asuparagasu.png' },
    ],
  },
  {
    name: '肉',
    value: 'beef',
    items: [
      { id: 'beef-1', name: '牛肉', image: '/images/asuparagasu.png' },
      { id: 'beef-2', name: '豚肉', image: '/images/asuparagasu.png' },
      { id: 'beef-3', name: '豚肉', image: '/images/asuparagasu.png' },
      { id: 'beef-4', name: '豚肉', image: '/images/asuparagasu.png' },
      { id: 'beef-5', name: '豚肉', image: '/images/asuparagasu.png' },
      { id: 'beef-6', name: '豚肉', image: '/images/asuparagasu.png' },
      { id: 'beef-7', name: '豚肉', image: '/images/asuparagasu.png' },
      { id: 'beef-8', name: '豚肉', image: '/images/asuparagasu.png' },
      { id: 'beef-9', name: '豚肉', image: '/images/asuparagasu.png' },
      { id: 'beef-10', name: '豚肉', image: '/images/asuparagasu.png' },
      { id: 'beef-11', name: '豚肉', image: '/images/asuparagasu.png' },
      { id: 'beef-12', name: '豚肉', image: '/images/asuparagasu.png' },
    ],
  },
  {
    name: '加工食品',
    value: 'processed',
    items: [
      { id: 'processed-1', name: 'フルーツ', image: '/images/asuparagasu.png' },
      { id: 'processed-2', name: 'フルーツ', image: '/images/asuparagasu.png' },
      { id: 'processed-3', name: 'フルーツ', image: '/images/asuparagasu.png' },
      { id: 'processed-4', name: 'フルーツ', image: '/images/asuparagasu.png' },
      { id: 'processed-5', name: 'フルーツ', image: '/images/asuparagasu.png' },
      { id: 'processed-6', name: 'フルーツ', image: '/images/asuparagasu.png' },
      { id: 'processed-7', name: 'フルーツ', image: '/images/asuparagasu.png' },
      { id: 'processed-8', name: 'フルーツ', image: '/images/asuparagasu.png' },
      { id: 'processed-9', name: 'フルーツ', image: '/images/asuparagasu.png' },
      {
        id: 'processed-10',
        name: 'フルーツ',
        image: '/images/asuparagasu.png',
      },
      {
        id: 'processed-11',
        name: 'フルーツ',
        image: '/images/asuparagasu.png',
      },
      {
        id: 'processed-12',
        name: 'フルーツ',
        image: '/images/asuparagasu.png',
      },
    ],
  },
  {
    name: 'その他',
    value: 'other',
    items: [
      { id: 'other-1', name: 'その他', image: '/images/asuparagasu.png' },
      { id: 'other-2', name: 'その他', image: '/images/asuparagasu.png' },
      { id: 'other-3', name: 'その他', image: '/images/asuparagasu.png' },
      { id: 'other-4', name: 'その他', image: '/images/asuparagasu.png' },
      { id: 'other-5', name: 'その他', image: '/images/asuparagasu.png' },
      { id: 'other-6', name: 'その他', image: '/images/asuparagasu.png' },
      { id: 'other-7', name: 'その他', image: '/images/asuparagasu.png' },
      { id: 'other-8', name: 'その他', image: '/images/asuparagasu.png' },
      { id: 'other-9', name: 'その他', image: '/images/asuparagasu.png' },
      { id: 'other-10', name: 'その他', image: '/images/asuparagasu.png' },
      { id: 'other-11', name: 'その他', image: '/images/asuparagasu.png' },
      { id: 'other-12', name: 'その他', image: '/images/asuparagasu.png' },
    ],
  },
];

export default function CookTabs() {
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('vegetable');
  const router = useRouter();

  const handleIngredientClick = (
    id: string,
    name: string,
    category: string
  ) => {
    setSelectedIngredients((prev: Ingredient[]) =>
      prev.some((item) => item.id === id)
        ? prev.filter((item) => item.id !== id)
        : [...prev, { id, name, category }]
    );
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    id: string,
    name: string,
    category: string
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleIngredientClick(id, name, category);
    }
  };

  const getSelectedIngredientsByCategory = () => {
    return categories.map((category) => ({
      ...category,
      selectedItems: selectedIngredients.filter(
        (item: Ingredient) => item.category === category.name
      ),
    }));
  };

  const handleRecipeGeneration = async () => {
    if (selectedIngredients.length === 0) return;

    setIsLoading(true);
    setError(null);

    const timeoutDuration = 10000;
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error('タイムアウトしました')),
        timeoutDuration
      )
    );

    try {
      const result = await Promise.race([
        generateRecipe(selectedIngredients),
        timeoutPromise,
      ]);
      if (result && typeof result === 'object' && 'recipeId' in result) {
        router.push(`/results/${result.recipeId}`);
      } else {
        throw new Error('レシピの生成に失敗しました');
      }
    } catch (error) {
      console.error('レシピ生成中にエラーが発生しました:', error);
      setError(
        error instanceof Error && error.message === 'タイムアウトしました'
          ? 'レシピの生成に時間がかかっています。もう一度お試しください。'
          : 'レシピの生成中にエラーが発生しました。もう一度お試しください。'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4 md:mb-8">
          {categories.map((category) => (
            <TabsTrigger key={category.value} value={category.value}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        role="grid"
      >
        {categories
          .find((category) => category.value === activeTab)
          ?.items.map((item) => (
            <div key={item.id} role="gridcell">
              <button
                className="w-full h-full focus:outline-none focus:ring-2 focus:ring-black rounded-md"
                onClick={() =>
                  handleIngredientClick(
                    item.id,
                    item.name,
                    categories.find((cat) => cat.value === activeTab)?.name ||
                      ''
                  )
                }
                onKeyDown={(e) =>
                  handleKeyDown(
                    e,
                    item.id,
                    item.name,
                    categories.find((cat) => cat.value === activeTab)?.name ||
                      ''
                  )
                }
                tabIndex={0}
                aria-pressed={selectedIngredients.some(
                  (selected: Ingredient) => selected.id === item.id
                )}
              >
                <CookCard
                  id={item.id}
                  name={item.name}
                  image={item.image}
                  isSelected={selectedIngredients.some(
                    (selected: Ingredient) => selected.id === item.id
                  )}
                  onClick={() =>
                    handleIngredientClick(
                      item.id,
                      item.name,
                      categories.find((cat) => cat.value === activeTab)?.name ||
                        ''
                    )
                  }
                />
              </button>
            </div>
          ))}
      </div>

      {/* 選択された食材の表示 */}
      <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          選択された食材
        </h2>
        {selectedIngredients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getSelectedIngredientsByCategory().map(
              (category) =>
                category.selectedItems.length > 0 && (
                  <div
                    key={category.value}
                    className="bg-white p-4 rounded-lg shadow transition-all duration-300 hover:shadow-md"
                  >
                    <h3 className="font-semibold text-center mb-2 text-lg text-gray-700">
                      {category.name}
                    </h3>
                    <ul className="space-y-2">
                      {category.selectedItems.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md"
                        >
                          <span>{item.name}</span>
                          <button
                            onClick={() =>
                              handleIngredientClick(
                                item.id,
                                item.name,
                                category.name
                              )
                            }
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          >
                            <X size={18} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
            )}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            選択された食材はありません。
          </p>
        )}
        <div className="mt-6 text-center">
          <Button
            disabled={selectedIngredients.length === 0 || isLoading}
            onClick={handleRecipeGeneration}
          >
            {isLoading ? 'レシピを生成中...' : 'レシピを提案する'}
          </Button>
        </div>
      </div>
    </div>
  );
}
