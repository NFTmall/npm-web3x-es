import { Contract } from "../../contract";
import abi from "./EnsResolverAbi";
export class EnsResolver extends Contract {
    constructor(eth, address, options) {
        super(eth, abi, address, options);
    }
}
export var EnsResolverAbi = abi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW5zUmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZW5zL2NvbnRyYWN0cy9FbnNSZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxPQUFPLEVBQUUsUUFBUSxFQUE2RCxNQUFNLGdCQUFnQixDQUFDO0FBRXJHLE9BQU8sR0FBRyxNQUFNLGtCQUFrQixDQUFDO0FBMkVuQyxNQUFNLE9BQU8sV0FBWSxTQUFRLFFBQStCO0lBQzVELFlBQVksR0FBUSxFQUFFLE9BQWlCLEVBQUUsT0FBeUI7UUFDOUQsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3RDLENBQUM7Q0FDSjtBQUNELE1BQU0sQ0FBQyxJQUFJLGNBQWMsR0FBRyxHQUFHLENBQUMifQ==