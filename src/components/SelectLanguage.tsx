import type { Languages } from '@/types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ISelectLanguage {
  languages: Languages;
  onChange: (value: string) => void;
  defaultValue: string;
}

export default function SelectLanguage({
  languages,
  onChange,
  defaultValue,
}: ISelectLanguage) {
  return (
    <Select onValueChange={onChange} defaultValue={defaultValue} required>
      <SelectTrigger>
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent className="max-h-[300px] overflow-y-auto">
        <SelectGroup>
          {Object.keys(languages).map(lang => (
            <SelectItem key={lang} value={lang}>
              <span>{languages[lang]!.name} </span>(
              <span className="capitalize">{languages[lang]!.nativeName}</span>)
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
